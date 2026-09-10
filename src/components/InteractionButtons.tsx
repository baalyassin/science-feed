"use client";

import { useState } from "react";
import { Bookmark, Heart } from "lucide-react";

async function sendInteraction(method: "POST" | "DELETE", type: string, articleId: string) {
  const res = await fetch("/api/interactions", {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, articleId }),
  });
  if (!res.ok) throw new Error("Interaction failed");
}

export function InteractionButtons({
  articleId,
  initialLiked = false,
  initialSaved = false,
  layout = "vertical",
}: {
  articleId: string;
  initialLiked?: boolean;
  initialSaved?: boolean;
  layout?: "vertical" | "horizontal";
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [saved, setSaved] = useState(initialSaved);

  async function toggleLike() {
    const next = !liked;
    setLiked(next);
    try {
      await sendInteraction(next ? "POST" : "DELETE", "LIKE", articleId);
    } catch {
      setLiked(!next);
    }
  }

  async function toggleSave() {
    const next = !saved;
    setSaved(next);
    try {
      await sendInteraction(next ? "POST" : "DELETE", "SAVE", articleId);
    } catch {
      setSaved(!next);
    }
  }

  const containerClass =
    layout === "vertical"
      ? "flex flex-col items-center gap-5"
      : "flex flex-row items-center gap-4";
  const iconSize = layout === "vertical" ? "w-6 h-6" : "w-5 h-5";

  return (
    <div className={containerClass}>
      <button
        type="button"
        onClick={toggleLike}
        aria-label="J'aime"
        className={`flex flex-col items-center gap-1 ${
          liked
            ? "text-indigo-600 dark:text-indigo-400"
            : "text-neutral-400 dark:text-neutral-500"
        }`}
      >
        <Heart className={iconSize} strokeWidth={1.5} fill={liked ? "currentColor" : "none"} />
        <span className="text-xs">J&apos;aime</span>
      </button>
      <button
        type="button"
        onClick={toggleSave}
        aria-label="Sauvegarder"
        className={`flex flex-col items-center gap-1 ${
          saved
            ? "text-indigo-600 dark:text-indigo-400"
            : "text-neutral-400 dark:text-neutral-500"
        }`}
      >
        <Bookmark className={iconSize} strokeWidth={1.5} fill={saved ? "currentColor" : "none"} />
        <span className="text-xs">Sauver</span>
      </button>
    </div>
  );
}
