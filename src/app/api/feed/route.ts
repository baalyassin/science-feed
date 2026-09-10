import { NextResponse, after } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { refillInterest } from "@/lib/sources/ingest";
import type { Prisma } from "@/generated/prisma/client";

const DEFAULT_LIMIT = 15;

interface Cursor {
  publishedAt: string;
  id: string;
}

function decodeCursor(raw: string | null): Cursor | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(Buffer.from(raw, "base64url").toString("utf8"));
    if (typeof parsed.publishedAt === "string" && typeof parsed.id === "string") {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function encodeCursor(cursor: Cursor): string {
  return Buffer.from(JSON.stringify(cursor), "utf8").toString("base64url");
}

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get("limit")) || DEFAULT_LIMIT, 50);
  const cursor = decodeCursor(searchParams.get("cursor"));

  const userInterests = await prisma.userInterest.findMany({
    where: { userId: session.user.id },
    include: { interest: { select: { id: true, key: true } } },
  });

  if (userInterests.length === 0) {
    return NextResponse.json({ articles: [], nextCursor: null });
  }

  const interestIds = userInterests.map((ui) => ui.interestId);
  const interestKeys = userInterests.map((ui) => ui.interest.key);

  const where: Prisma.ArticleWhereInput = {
    publishedAt: { not: null },
    interests: { some: { interestId: { in: interestIds } } },
    interactions: { none: { userId: session.user.id } },
  };

  if (cursor) {
    where.AND = [
      {
        OR: [
          { publishedAt: { lt: new Date(cursor.publishedAt) } },
          {
            AND: [{ publishedAt: new Date(cursor.publishedAt) }, { id: { lt: cursor.id } }],
          },
        ],
      },
    ];
  }

  const rows = await prisma.article.findMany({
    where,
    orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
    take: limit + 1,
    include: { interests: { select: { interest: { select: { key: true } } } } },
  });

  const hasMore = rows.length > limit;
  const page = hasMore ? rows.slice(0, limit) : rows;

  const articles = page.map((article) => ({
    id: article.id,
    source: article.source,
    title: article.title,
    abstract: article.abstract,
    authors: JSON.parse(article.authors) as string[],
    url: article.url,
    pdfUrl: article.pdfUrl,
    publishedAt: article.publishedAt,
    venue: article.venue,
    citationCount: article.citationCount,
    interestKeys: article.interests.map((i) => i.interest.key),
  }));

  const last = page[page.length - 1];
  const nextCursor =
    hasMore && last?.publishedAt
      ? encodeCursor({ publishedAt: last.publishedAt.toISOString(), id: last.id })
      : null;

  // Cache is running low for this user — top it up in the background for next time.
  if (page.length < limit) {
    after(async () => {
      await Promise.all(interestKeys.map((key) => refillInterest(key).catch(() => undefined)));
    });
  }

  return NextResponse.json({ articles, nextCursor });
}
