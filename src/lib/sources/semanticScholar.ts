import type { NormalizedArticle } from "./types";

const S2_API = "https://api.semanticscholar.org/graph/v1/paper/search";
const FIELDS =
  "title,abstract,authors,url,openAccessPdf,publicationDate,venue,citationCount";

interface S2Author {
  name: string;
}

interface S2Paper {
  paperId: string;
  title?: string;
  abstract?: string | null;
  authors?: S2Author[];
  url?: string;
  openAccessPdf?: { url: string } | null;
  publicationDate?: string | null;
  venue?: string | null;
  citationCount?: number | null;
}

function parsePaper(paper: S2Paper): NormalizedArticle | null {
  if (!paper.paperId || !paper.title) return null;

  return {
    source: "semanticscholar",
    externalId: paper.paperId,
    title: paper.title,
    abstract: paper.abstract ?? null,
    authors: (paper.authors ?? []).map((a) => a.name).filter(Boolean),
    url: paper.url ?? `https://www.semanticscholar.org/paper/${paper.paperId}`,
    pdfUrl: paper.openAccessPdf?.url ?? null,
    publishedAt: paper.publicationDate ? new Date(paper.publicationDate) : null,
    venue: paper.venue ?? null,
    citationCount: paper.citationCount ?? null,
  };
}

async function fetchAndParse(url: string): Promise<NormalizedArticle[]> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    // Free tier is rate-limited; degrade gracefully instead of failing the whole feed/search.
    if (res.status === 429) return [];
    throw new Error(`Semantic Scholar API error: ${res.status}`);
  }
  const data = (await res.json()) as { data?: S2Paper[] };
  return (data.data ?? [])
    .map(parsePaper)
    .filter((a): a is NormalizedArticle => a !== null);
}

export async function fetchSemanticScholarByField(
  query: string,
  fieldsOfStudy: string[],
  opts: { limit?: number } = {},
): Promise<NormalizedArticle[]> {
  const limit = opts.limit ?? 25;
  const params = new URLSearchParams({
    query,
    fields: FIELDS,
    limit: String(limit),
    sort: "publicationDate:desc",
  });
  if (fieldsOfStudy.length > 0) {
    params.set("fieldsOfStudy", fieldsOfStudy.join(","));
  }

  return fetchAndParse(`${S2_API}?${params.toString()}`);
}

export async function searchSemanticScholar(
  query: string,
  limit = 20,
): Promise<NormalizedArticle[]> {
  const params = new URLSearchParams({ query, fields: FIELDS, limit: String(limit) });
  return fetchAndParse(`${S2_API}?${params.toString()}`);
}
