"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFeedInfiniteQuery } from "@/hooks/useFeedInfiniteQuery";
import { ArticleCard } from "@/components/ArticleCard";

const SEEN_FLUSH_INTERVAL_MS = 3000;

function flushSeen(ids: string[]) {
  if (ids.length === 0) return;
  const body = JSON.stringify({ type: "SEEN", articleIds: ids });
  if (navigator.sendBeacon) {
    navigator.sendBeacon(
      "/api/interactions",
      new Blob([body], { type: "application/json" }),
    );
    return;
  }
  fetch("/api/interactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined);
}

export function FeedList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useFeedInfiniteQuery();
  const containerRef = useRef<HTMLDivElement>(null);
  const seenQueue = useRef<Set<string>>(new Set());
  const [skipped, setSkipped] = useState<Set<string>>(new Set());

  const articles = useMemo(() => {
    const all = data?.pages.flatMap((page) => page.articles) ?? [];
    return all.filter((article) => !skipped.has(article.id));
  }, [data, skipped]);

  function handleSkip(articleId: string) {
    setSkipped((prev) => {
      const next = new Set(prev);
      next.add(articleId);
      return next;
    });
    fetch("/api/interactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "SKIP", articleId }),
    }).catch(() => undefined);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (seenQueue.current.size === 0) return;
      const ids = Array.from(seenQueue.current);
      seenQueue.current.clear();
      flushSeen(ids);
    }, SEEN_FLUSH_INTERVAL_MS);

    return () => {
      clearInterval(interval);
      if (seenQueue.current.size > 0) {
        flushSeen(Array.from(seenQueue.current));
        seenQueue.current.clear();
      }
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = Array.from(
      container.querySelectorAll<HTMLElement>("[data-article-id]"),
    );
    if (cards.length === 0) return;

    const lastCard = cards[cards.length - 1];

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.getAttribute("data-article-id");
          if (!id) continue;

          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            seenQueue.current.add(id);
          }

          if (
            entry.target === lastCard &&
            entry.isIntersecting &&
            hasNextPage &&
            !isFetchingNextPage
          ) {
            fetchNextPage();
          }
        }
      },
      { root: container, threshold: [0, 0.6] },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [articles.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-neutral-500">
        Chargement du feed...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-red-600 px-6 text-center">
        Impossible de charger le feed pour le moment.
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-center px-6 gap-2">
        <p className="text-lg font-medium">Plus rien de nouveau pour l&apos;instant</p>
        <p className="text-sm text-neutral-500">
          Reviens un peu plus tard, on va chercher de nouveaux articles pour toi.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 min-h-0 overflow-y-scroll snap-y snap-mandatory"
    >
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} onSkip={handleSkip} />
      ))}
      {isFetchingNextPage && (
        <div className="h-16 flex items-center justify-center text-xs text-neutral-500">
          Chargement...
        </div>
      )}
    </div>
  );
}
