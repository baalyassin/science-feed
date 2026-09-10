import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const interactionType = z.enum(["SEEN", "LIKE", "SAVE", "SKIP"]);

const bodySchema = z.object({
  type: interactionType,
  articleId: z.string().optional(),
  articleIds: z.array(z.string()).optional(),
});

function extractArticleIds(data: z.infer<typeof bodySchema>): string[] {
  const ids = new Set<string>();
  if (data.articleId) ids.add(data.articleId);
  for (const id of data.articleIds ?? []) ids.add(id);
  return Array.from(ids);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const articleIds = extractArticleIds(parsed.data);
  if (articleIds.length === 0) {
    return NextResponse.json({ error: "Aucun article fourni." }, { status: 400 });
  }

  const userId = session.user.id;
  const { type } = parsed.data;

  for (const articleId of articleIds) {
    await prisma.interaction.upsert({
      where: { userId_articleId_type: { userId, articleId, type } },
      update: {},
      create: { userId, articleId, type },
    });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const articleIds = extractArticleIds(parsed.data);
  if (articleIds.length === 0) {
    return NextResponse.json({ error: "Aucun article fourni." }, { status: 400 });
  }

  const userId = session.user.id;
  const { type } = parsed.data;

  await prisma.interaction.deleteMany({
    where: { userId, type, articleId: { in: articleIds } },
  });

  return NextResponse.json({ ok: true });
}
