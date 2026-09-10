import { findInterest } from "@/lib/taxonomy";
import { fetchArxivByCategories } from "./arxiv";
import { fetchSemanticScholarByField } from "./semanticScholar";
import { upsertArticles } from "./normalizer";

export async function refillInterest(interestKey: string, maxResultsPerSource = 25) {
  const def = findInterest(interestKey);
  if (!def) return;

  const [arxivArticles, s2Articles] = await Promise.all([
    def.arxivCodes.length > 0
      ? fetchArxivByCategories(def.arxivCodes, { maxResults: maxResultsPerSource }).catch(
          () => [],
        )
      : Promise.resolve([]),
    fetchSemanticScholarByField(def.s2SearchTerm, def.s2Fields, {
      limit: maxResultsPerSource,
    }).catch(() => []),
  ]);

  await upsertArticles([...arxivArticles, ...s2Articles], [interestKey]);
}
