export interface InterestColor {
  /** Icon glyph color. */
  icon: string;
  /** Icon chip background. */
  chip: string;
  /** Small text/pill badge (e.g. category tag on a card). */
  badge: string;
  /** Solid accent bar. */
  bar: string;
}

export const INTEREST_COLORS: Record<string, InterestColor> = {
  ai_ml: {
    icon: "text-violet-600 dark:text-violet-400",
    chip: "bg-violet-100 dark:bg-violet-500/15",
    badge: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
    bar: "bg-violet-500",
  },
  physics: {
    icon: "text-sky-600 dark:text-sky-400",
    chip: "bg-sky-100 dark:bg-sky-500/15",
    badge: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
    bar: "bg-sky-500",
  },
  biology: {
    icon: "text-emerald-600 dark:text-emerald-400",
    chip: "bg-emerald-100 dark:bg-emerald-500/15",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    bar: "bg-emerald-500",
  },
  medicine: {
    icon: "text-rose-600 dark:text-rose-400",
    chip: "bg-rose-100 dark:bg-rose-500/15",
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
    bar: "bg-rose-500",
  },
  neuroscience: {
    icon: "text-fuchsia-600 dark:text-fuchsia-400",
    chip: "bg-fuchsia-100 dark:bg-fuchsia-500/15",
    badge: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-300",
    bar: "bg-fuchsia-500",
  },
  chemistry: {
    icon: "text-amber-600 dark:text-amber-400",
    chip: "bg-amber-100 dark:bg-amber-500/15",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    bar: "bg-amber-500",
  },
  math: {
    icon: "text-blue-600 dark:text-blue-400",
    chip: "bg-blue-100 dark:bg-blue-500/15",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
    bar: "bg-blue-500",
  },
  astronomy: {
    icon: "text-indigo-600 dark:text-indigo-400",
    chip: "bg-indigo-100 dark:bg-indigo-500/15",
    badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
    bar: "bg-indigo-500",
  },
  psychology: {
    icon: "text-pink-600 dark:text-pink-400",
    chip: "bg-pink-100 dark:bg-pink-500/15",
    badge: "bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300",
    bar: "bg-pink-500",
  },
  climate: {
    icon: "text-teal-600 dark:text-teal-400",
    chip: "bg-teal-100 dark:bg-teal-500/15",
    badge: "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300",
    bar: "bg-teal-500",
  },
  economics: {
    icon: "text-orange-600 dark:text-orange-400",
    chip: "bg-orange-100 dark:bg-orange-500/15",
    badge: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
    bar: "bg-orange-500",
  },
  engineering: {
    icon: "text-cyan-600 dark:text-cyan-400",
    chip: "bg-cyan-100 dark:bg-cyan-500/15",
    badge: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300",
    bar: "bg-cyan-500",
  },
};

export const DEFAULT_INTEREST_COLOR: InterestColor = {
  icon: "text-neutral-600 dark:text-neutral-400",
  chip: "bg-neutral-100 dark:bg-neutral-800",
  badge: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
  bar: "bg-neutral-400",
};
