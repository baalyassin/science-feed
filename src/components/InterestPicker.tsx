"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { DEFAULT_INTEREST_ICON, INTEREST_ICONS } from "@/components/interestIcons";
import { DEFAULT_INTEREST_COLOR, INTEREST_COLORS } from "@/components/interestColors";

interface InterestOption {
  key: string;
  label: string;
}

export function InterestPicker({ interests }: { interests: InterestOption[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function toggle(key: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  async function handleSubmit() {
    if (selected.size === 0) {
      setError("Choisis au moins un centre d'intérêt.");
      return;
    }
    setError(null);
    setLoading(true);

    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interestKeys: Array.from(selected) }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Une erreur est survenue.");
      return;
    }

    router.push("/feed");
    router.refresh();
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {interests.map((interest) => {
          const isSelected = selected.has(interest.key);
          const Icon = INTEREST_ICONS[interest.key] ?? DEFAULT_INTEREST_ICON;
          const color = INTEREST_COLORS[interest.key] ?? DEFAULT_INTEREST_COLOR;
          return (
            <button
              key={interest.key}
              type="button"
              onClick={() => toggle(interest.key)}
              className={`relative flex flex-col items-center justify-center gap-2.5 rounded-xl border px-4 py-6 text-sm font-medium transition-colors ${
                isSelected
                  ? "border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-500/10"
                  : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600"
              }`}
            >
              {isSelected && (
                <CheckCircle2
                  className="absolute top-2 right-2 w-4 h-4 text-indigo-600 dark:text-indigo-400"
                  strokeWidth={2}
                />
              )}
              <span
                className={`flex items-center justify-center w-11 h-11 rounded-full ${color.chip}`}
              >
                <Icon className={`w-5 h-5 ${color.icon}`} strokeWidth={1.75} />
              </span>
              <span
                className={
                  isSelected
                    ? "text-center text-indigo-900 dark:text-indigo-100"
                    : "text-center text-neutral-700 dark:text-neutral-300"
                }
              >
                {interest.label}
              </span>
            </button>
          );
        })}
      </div>

      {error && <p className="text-sm text-red-600 mt-4 text-center">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="w-full rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white py-3 text-sm font-medium mt-8 disabled:opacity-50 hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
      >
        {loading ? "Enregistrement..." : `Continuer (${selected.size} sélectionné${selected.size > 1 ? "s" : ""})`}
      </button>
    </div>
  );
}
