import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { searchArxiv } from "@/lib/sources/arxiv";
import { searchSemanticScholar } from "@/lib/sources/semanticScholar";
import { upsertArticles } from "@/lib/sources/normalizer";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json({ articles: [] });
  }

  const [arxivResults, s2Results] = await Promise.all([
    searchArxiv(query, 15).catch(() => []),
    searchSemanticScholar(query, 15).catch(() => []),
  ]);

  const merged = [];
  const max = Math.max(arxivResults.length, s2Results.length);
  for (let i = 0; i < max; i++) {
    if (arxivResults[i]) merged.push(arxivResults[i]);
    if (s2Results[i]) merged.push(s2Results[i]);
  }

  const saved = await upsertArticles(merged);

  const likedAndSaved = await prisma.interaction.findMany({
    where: {
      userId: session.user.id,
      articleId: { in: saved.map((a) => a.id) },
      type: { in: ["LIKE", "SAVE"] },
    },
    select: { articleId: true, type: true },
  });

  const likedIds = new Set(
    likedAndSaved.filter((i) => i.type === "LIKE").map((i) => i.articleId),
  );
  const savedIds = new Set(
    likedAndSaved.filter((i) => i.type === "SAVE").map((i) => i.articleId),
  );

  const articles = saved.map((article) => ({
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
    liked: likedIds.has(article.id),
    saved: savedIds.has(article.id),
  }));

  return NextResponse.json({ articles });
}
