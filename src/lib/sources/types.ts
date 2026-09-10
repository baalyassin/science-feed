export type ArticleSource = "arxiv" | "semanticscholar";

export interface NormalizedArticle {
  source: ArticleSource;
  externalId: string;
  title: string;
  abstract: string | null;
  authors: string[];
  url: string;
  pdfUrl: string | null;
  publishedAt: Date | null;
  venue: string | null;
  citationCount: number | null;
}
