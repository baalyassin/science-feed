import {
  Atom,
  BookOpen,
  Bot,
  Brain,
  Cog,
  Dna,
  FlaskConical,
  Leaf,
  Puzzle,
  Sigma,
  Stethoscope,
  Telescope,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

export const INTEREST_ICONS: Record<string, LucideIcon> = {
  ai_ml: Bot,
  physics: Atom,
  biology: Dna,
  medicine: Stethoscope,
  neuroscience: Brain,
  chemistry: FlaskConical,
  math: Sigma,
  astronomy: Telescope,
  psychology: Puzzle,
  climate: Leaf,
  economics: TrendingUp,
  engineering: Cog,
};

export const DEFAULT_INTEREST_ICON: LucideIcon = BookOpen;
