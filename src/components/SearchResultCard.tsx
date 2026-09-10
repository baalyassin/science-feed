import { ExternalLink, FileText } from "lucide-react";
import type { SearchArticle } from "@/lib/feedTypes";
import { InteractionButtons } from "@/components/InteractionButtons";

const SOURCE_LABEL: Record<SearchArticle["source"], string> = {
  arxiv: "arXiv",
  semanticscholar: "Semantic Scholar",
};

export function SearchResultCard({ article }: { article: SearchArticle }) {
  const authorsLabel =
    article.authors.length > 4
      ? `${article.authors.slice(0, 4).join(", ")} et al.`
      : article.authors.join(", ");

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-neutral-500">
        <span className="rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5">
          {SOURCE_LABEL[article.source]}
        </span>
        {article.publishedAt && (
          <span>{new Date(article.publishedAt).toLocaleDateString("fr-FR")}</span>
        )}
      </div>

      <h3 className="text-base font-semibold leading-snug">{article.title}</h3>
      {authorsLabel && <p className="text-xs text-neutral-500">{authorsLabel}</p>}
      {article.abstract && (
        <p className="text-sm text-neutral-700 dark:text-neutral-300 line-clamp-3">
          {article.abstract}
        </p>
      )}

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-4">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white px-3 py-1.5 text-xs font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
          >
            Lire l&apos;article
            <ExternalLink className="w-3 h-3" strokeWidth={2} />
          </a>
          {article.pdfUrl && (
            <a
              href={article.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs underline text-neutral-500"
            >
              <FileText className="w-3 h-3" strokeWidth={2} />
              PDF
            </a>
          )}
        </div>
        <InteractionButtons
          articleId={article.id}
          initialLiked={article.liked}
          initialSaved={article.saved}
          layout="horizontal"
        />
      </div>
    </div>
  );
}
