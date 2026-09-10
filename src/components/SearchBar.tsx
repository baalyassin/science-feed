"use client";

import { useState } from "react";
import type { SearchArticle } from "@/lib/feedTypes";
import { SearchResultCard } from "@/components/SearchResultCard";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setResults(data.articles ?? []);
    } catch {
      setError("La recherche a échoué. Réessaie dans un instant.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <form onSubmit={handleSubmit} className="flex gap-2 px-4 pt-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un sujet, un mot-clé..."
          className="flex-1 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 text-sm font-medium disabled:opacity-50 hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
        >
          {loading ? "..." : "Chercher"}
        </button>
      </form>

      <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4 flex flex-col gap-3">
        {error && <p className="text-sm text-red-600 text-center mt-8">{error}</p>}

        {!error && !loading && searched && results.length === 0 && (
          <p className="text-sm text-neutral-500 text-center mt-8">
            Aucun résultat pour cette recherche.
          </p>
        )}

        {!searched && (
          <p className="text-sm text-neutral-500 text-center mt-8">
            Cherche un sujet précis directement dans arXiv et Semantic Scholar.
          </p>
        )}

        {results.map((article) => (
          <SearchResultCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
