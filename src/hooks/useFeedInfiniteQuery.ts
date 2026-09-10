"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import type { FeedPage } from "@/lib/feedTypes";

async function fetchFeedPage(cursor: string | null): Promise<FeedPage> {
  const params = new URLSearchParams();
  if (cursor) params.set("cursor", cursor);

  const res = await fetch(`/api/feed?${params.toString()}`);
  if (!res.ok) {
    throw new Error("Impossible de charger le feed.");
  }
  return res.json();
}

export function useFeedInfiniteQuery() {
  return useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: ({ pageParam }) => fetchFeedPage(pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}
