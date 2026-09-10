export interface InterestDefinition {
  key: string;
  label: string;
  arxivCodes: string[];
  s2Fields: string[];
  /** Broad seed term used to query Semantic Scholar, which has no pure "browse by field" endpoint. */
  s2SearchTerm: string;
}

export const INTERESTS: InterestDefinition[] = [
  {
    key: "ai_ml",
    label: "IA & Machine Learning",
    arxivCodes: ["cs.AI", "cs.LG", "cs.CL", "cs.CV", "stat.ML"],
    s2Fields: ["Computer Science"],
    s2SearchTerm: "machine learning",
  },
  {
    key: "physics",
    label: "Physique",
    arxivCodes: ["physics.gen-ph", "quant-ph", "hep-th", "hep-ph"],
    s2Fields: ["Physics"],
    s2SearchTerm: "physics",
  },
  {
    key: "biology",
    label: "Biologie",
    arxivCodes: ["q-bio.GN", "q-bio.CB", "q-bio.PE"],
    s2Fields: ["Biology"],
    s2SearchTerm: "biology",
  },
  {
    key: "medicine",
    label: "Médecine",
    arxivCodes: ["q-bio.QM"],
    s2Fields: ["Medicine"],
    s2SearchTerm: "clinical medicine",
  },
  {
    key: "neuroscience",
    label: "Neurosciences",
    arxivCodes: ["q-bio.NC"],
    s2Fields: ["Neuroscience"],
    s2SearchTerm: "neuroscience",
  },
  {
    key: "chemistry",
    label: "Chimie",
    arxivCodes: ["cond-mat.mtrl-sci"],
    s2Fields: ["Chemistry"],
    s2SearchTerm: "chemistry",
  },
  {
    key: "math",
    label: "Mathématiques",
    arxivCodes: ["math.CO", "math.NT", "math.PR", "math.ST"],
    s2Fields: ["Mathematics"],
    s2SearchTerm: "mathematics",
  },
  {
    key: "astronomy",
    label: "Astronomie",
    arxivCodes: ["astro-ph.CO", "astro-ph.GA", "astro-ph.EP"],
    s2Fields: ["Physics"],
    s2SearchTerm: "astronomy astrophysics",
  },
  {
    key: "psychology",
    label: "Psychologie",
    arxivCodes: [],
    s2Fields: ["Psychology"],
    s2SearchTerm: "psychology",
  },
  {
    key: "climate",
    label: "Climat & Environnement",
    arxivCodes: ["physics.ao-ph"],
    s2Fields: ["Environmental Science"],
    s2SearchTerm: "climate change",
  },
  {
    key: "economics",
    label: "Économie",
    arxivCodes: ["econ.GN", "econ.TH", "q-fin.GN"],
    s2Fields: ["Economics"],
    s2SearchTerm: "economics",
  },
  {
    key: "engineering",
    label: "Ingénierie",
    arxivCodes: ["eess.SY", "eess.SP"],
    s2Fields: ["Engineering"],
    s2SearchTerm: "engineering",
  },
];

export function findInterest(key: string): InterestDefinition | undefined {
  return INTERESTS.find((i) => i.key === key);
}
