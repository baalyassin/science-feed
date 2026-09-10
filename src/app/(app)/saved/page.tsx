import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SearchResultCard } from "@/components/SearchResultCard";
import type { SearchArticle } from "@/lib/feedTypes";

export default async function SavedPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const interactions = await prisma.interaction.findMany({
    where: { userId: session.user.id, type: { in: ["LIKE", "SAVE"] } },
    include: { article: true },
    orderBy: { createdAt: "desc" },
  });

  const byArticle = new Map<
    string,
    { article: (typeof interactions)[number]["article"]; liked: boolean; saved: boolean }
  >();

  for (const interaction of interactions) {
    const existing = byArticle.get(interaction.articleId);
    if (existing) {
      if (interaction.type === "LIKE") existing.liked = true;
      if (interaction.type === "SAVE") existing.saved = true;
    } else {
      byArticle.set(interaction.articleId, {
        article: interaction.article,
        liked: interaction.type === "LIKE",
        saved: interaction.type === "SAVE",
      });
    }
  }

  const items: SearchArticle[] = Array.from(byArticle.values()).map(
    ({ article, liked, saved }) => ({
      id: article.id,
      source: article.source as SearchArticle["source"],
      title: article.title,
      abstract: article.abstract,
      authors: JSON.parse(article.authors) as string[],
      url: article.url,
      pdfUrl: article.pdfUrl,
      publishedAt: article.publishedAt ? article.publishedAt.toISOString() : null,
      venue: article.venue,
      citationCount: article.citationCount,
      liked,
      saved,
    }),
  );

  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 flex flex-col gap-3">
      <h1 className="text-lg font-semibold">Tes articles sauvegardés</h1>
      {items.length === 0 ? (
        <p className="text-sm text-neutral-500 text-center mt-8">
          Tu n&apos;as encore rien liké ni sauvegardé.
        </p>
      ) : (
        items.map((article) => <SearchResultCard key={article.id} article={article} />)
      )}
    </div>
  );
}
