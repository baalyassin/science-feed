import { ExternalLink, FileText, X } from "lucide-react";
import type { FeedArticle } from "@/lib/feedTypes";
import { InteractionButtons } from "@/components/InteractionButtons";
import { findInterest } from "@/lib/taxonomy";
import { DEFAULT_INTEREST_COLOR, INTEREST_COLORS } from "@/components/interestColors";

const SOURCE_LABEL: Record<FeedArticle["source"], string> = {
  arxiv: "arXiv",
  semanticscholar: "Semantic Scholar",
};

export function ArticleCard({
  article,
  onSkip,
  initialLiked,
  initialSaved,
}: {
  article: FeedArticle;
  onSkip?: (articleId: string) => void;
  initialLiked?: boolean;
  initialSaved?: boolean;
}) {
  const authorsLabel =
    article.authors.length > 4
      ? `${article.authors.slice(0, 4).join(", ")} et al.`
      : article.authors.join(", ");

  const primaryInterestKey = article.interestKeys[0];
  const primaryInterestLabel = primaryInterestKey
    ? findInterest(primaryInterestKey)?.label
    : undefined;
  const color = primaryInterestKey
    ? (INTEREST_COLORS[primaryInterestKey] ?? DEFAULT_INTEREST_COLOR)
    : DEFAULT_INTEREST_COLOR;

  return (
    <article
      data-article-id={article.id}
      className="relative h-full w-full shrink-0 snap-start flex items-center justify-center px-5"
    >
      <span className={`absolute left-0 top-0 h-full w-1 ${color.bar}`} aria-hidden="true" />

      <div className="w-full max-w-lg flex flex-col gap-4 py-10 pr-14">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-neutral-500">
          <span className="rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5">
            {SOURCE_LABEL[article.source]}
          </span>
          {primaryInterestLabel && (
            <span className={`rounded-full px-2 py-0.5 normal-case ${color.badge}`}>
              {primaryInterestLabel}
            </span>
          )}
          {article.publishedAt && (
            <span>{new Date(article.publishedAt).toLocaleDateString("fr-FR")}</span>
          )}
          {article.citationCount != null && article.citationCount > 0 && (
            <span>{article.citationCount} citations</span>
          )}
        </div>

        <h2 className="text-xl sm:text-2xl font-semibold leading-snug">{article.title}</h2>

        {authorsLabel && <p className="text-sm text-neutral-500">{authorsLabel}</p>}

        {article.abstract && (
          <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 max-h-64 overflow-y-auto">
            {article.abstract}
          </p>
        )}

        <div className="flex items-center gap-4 pt-2">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 text-sm font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
          >
            Lire l&apos;article
            <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
          </a>
          {article.pdfUrl && (
            <a
              href={article.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm underline text-neutral-500"
            >
              <FileText className="w-3.5 h-3.5" strokeWidth={2} />
              PDF
            </a>
          )}
        </div>
      </div>

      <div className="absolute right-3 bottom-10 flex flex-col items-center gap-5">
        <InteractionButtons
          articleId={article.id}
          initialLiked={initialLiked}
          initialSaved={initialSaved}
        />
        {onSkip && (
          <button
            type="button"
            onClick={() => onSkip(article.id)}
            aria-label="Pas intéressé"
            className="flex flex-col items-center gap-1 text-neutral-400 dark:text-neutral-500"
          >
            <X className="w-6 h-6" strokeWidth={1.5} />
            <span className="text-xs">Passer</span>
          </button>
        )}
      </div>
    </article>
  );
}
