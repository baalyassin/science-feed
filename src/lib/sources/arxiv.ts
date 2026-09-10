import { XMLParser } from "fast-xml-parser";
import type { NormalizedArticle } from "./types";

const ARXIV_API = "http://export.arxiv.org/api/query";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});

interface ArxivLink {
  "@_href": string;
  "@_rel"?: string;
  "@_type"?: string;
  "@_title"?: string;
}

interface ArxivAuthor {
  name: string;
}

interface ArxivEntry {
  id: string;
  title: string;
  summary?: string;
  published?: string;
  author?: ArxivAuthor | ArxivAuthor[];
  link?: ArxivLink | ArxivLink[];
}

function toArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function cleanText(value: string | undefined): string | null {
  if (!value) return null;
  const cleaned = value.replace(/\s+/g, " ").trim();
  return cleaned.length > 0 ? cleaned : null;
}

function parseEntry(entry: ArxivEntry): NormalizedArticle {
  const idUrl = entry.id;
  const externalId = idUrl.includes("/abs/") ? idUrl.split("/abs/")[1] : idUrl;

  const links = toArray(entry.link);
  const pdfLink = links.find(
    (link) => link["@_title"] === "pdf" || link["@_type"] === "application/pdf",
  );
  const htmlLink = links.find((link) => link["@_rel"] === "alternate") ?? links[0];

  const authors = toArray(entry.author)
    .map((author) => author.name)
    .filter((name): name is string => Boolean(name));

  return {
    source: "arxiv",
    externalId,
    title: cleanText(entry.title) ?? "(sans titre)",
    abstract: cleanText(entry.summary),
    authors,
    url: htmlLink?.["@_href"] ?? idUrl,
    pdfUrl: pdfLink?.["@_href"] ?? null,
    publishedAt: entry.published ? new Date(entry.published) : null,
    venue: null,
    citationCount: null,
  };
}

async function fetchAndParse(url: string): Promise<NormalizedArticle[]> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`arXiv API error: ${res.status}`);
  }
  const xml = await res.text();
  const parsed = parser.parse(xml) as { feed?: { entry?: ArxivEntry | ArxivEntry[] } };
  const entries = toArray(parsed.feed?.entry);
  return entries.map(parseEntry);
}

export async function fetchArxivByCategories(
  categories: string[],
  opts: { maxResults?: number } = {},
): Promise<NormalizedArticle[]> {
  if (categories.length === 0) return [];
  const maxResults = opts.maxResults ?? 25;

  const searchQuery = categories.map((cat) => `cat:${cat}`).join(" OR ");
  const params = new URLSearchParams({
    search_query: searchQuery,
    sortBy: "submittedDate",
    sortOrder: "descending",
    max_results: String(maxResults),
  });

  return fetchAndParse(`${ARXIV_API}?${params.toString()}`);
}

export async function searchArxiv(query: string, maxResults = 20): Promise<NormalizedArticle[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  // Phrase search (not per-word AND) — ANDing individual words fails as soon as the
  // query contains common words (e.g. "attention is all you need" matches nothing
  // when "is"/"all"/"you" are each required as separate mandatory terms).
  const params = new URLSearchParams({
    search_query: `all:"${trimmed}"`,
    sortBy: "relevance",
    sortOrder: "descending",
    max_results: String(maxResults),
  });

  return fetchAndParse(`${ARXIV_API}?${params.toString()}`);
}
