export interface FeedArticle {
  id: string;
  source: "arxiv" | "semanticscholar";
  title: string;
  abstract: string | null;
  authors: string[];
  url: string;
  pdfUrl: string | null;
  publishedAt: string | null;
  venue: string | null;
  citationCount: number | null;
  interestKeys: string[];
}

export interface FeedPage {
  articles: FeedArticle[];
  nextCursor: string | null;
}

export interface SearchArticle {
  id: string;
  source: "arxiv" | "semanticscholar";
  title: string;
  abstract: string | null;
  authors: string[];
  url: string;
  pdfUrl: string | null;
  publishedAt: string | null;
  venue: string | null;
  citationCount: number | null;
  liked: boolean;
  saved: boolean;
}
