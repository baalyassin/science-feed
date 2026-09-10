import { prisma } from "@/lib/prisma";
import type { NormalizedArticle } from "./types";

export async function upsertArticle(article: NormalizedArticle, interestKeys: string[] = []) {
  const data = {
    title: article.title,
    abstract: article.abstract,
    authors: JSON.stringify(article.authors),
    url: article.url,
    pdfUrl: article.pdfUrl,
    publishedAt: article.publishedAt,
    venue: article.venue,
    citationCount: article.citationCount,
  };

  const saved = await prisma.article.upsert({
    where: {
      source_externalId: { source: article.source, externalId: article.externalId },
    },
    update: data,
    create: {
      source: article.source,
      externalId: article.externalId,
      ...data,
    },
  });

  if (interestKeys.length > 0) {
    const interests = await prisma.interest.findMany({
      where: { key: { in: interestKeys } },
      select: { id: true },
    });

    for (const interest of interests) {
      await prisma.articleInterest.upsert({
        where: { articleId_interestId: { articleId: saved.id, interestId: interest.id } },
        update: {},
        create: { articleId: saved.id, interestId: interest.id },
      });
    }
  }

  return saved;
}

export async function upsertArticles(articles: NormalizedArticle[], interestKeys: string[] = []) {
  const saved = [];
  for (const article of articles) {
    saved.push(await upsertArticle(article, interestKeys));
  }
  return saved;
}
