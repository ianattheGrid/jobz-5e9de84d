// Title similarity scoring with synonym groups + fuzzy fallback.
// Returns a number between 0 and 1.

// Edit this list to teach the matcher new equivalences.
// Any two titles that appear in the SAME inner array are treated as ~equivalent.
const SYNONYM_GROUPS: string[][] = [
  // IT support
  ["it helpdesk advisor", "it helpdesk", "helpdesk advisor", "1st line support", "first line support", "it support technician", "service desk analyst", "desktop support"],
  ["2nd line support", "second line support", "infrastructure support", "systems support"],
  ["3rd line support", "third line support", "senior support engineer"],
  // Software engineering
  ["frontend developer", "front end developer", "front-end developer", "ui developer", "react developer", "javascript developer"],
  ["backend developer", "back end developer", "back-end developer", "server-side developer", "api developer"],
  ["fullstack developer", "full stack developer", "full-stack developer"],
  ["software engineer", "software developer", "programmer", "applications developer"],
  ["mobile developer", "ios developer", "android developer", "react native developer"],
  // Data
  ["data analyst", "business intelligence analyst", "bi analyst", "reporting analyst"],
  ["data scientist", "machine learning engineer", "ml engineer", "ai engineer"],
  ["data engineer", "etl developer", "analytics engineer"],
  // Ops
  ["devops engineer", "site reliability engineer", "sre", "platform engineer", "infrastructure engineer"],
  ["cloud engineer", "aws engineer", "azure engineer", "gcp engineer"],
  // QA
  ["qa engineer", "test engineer", "software tester", "quality assurance engineer", "automation tester"],
  // Management
  ["project manager", "pm", "programme manager", "delivery manager"],
  ["product manager", "product owner", "po"],
  ["engineering manager", "tech lead", "team lead", "lead developer"],
  // Design
  ["ux designer", "user experience designer", "product designer", "ui designer", "ux/ui designer"],
  // Sales / marketing
  ["account executive", "sales executive", "business development manager", "bdm"],
  ["marketing manager", "digital marketing manager", "growth marketer"],
];

const normalize = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

// Dice's coefficient on character bigrams — robust to small typos/word order.
const diceCoefficient = (a: string, b: string): number => {
  if (!a || !b) return 0;
  if (a === b) return 1;
  if (a.length < 2 || b.length < 2) return 0;

  const bigrams = (str: string) => {
    const set = new Map<string, number>();
    for (let i = 0; i < str.length - 1; i++) {
      const bg = str.slice(i, i + 2);
      set.set(bg, (set.get(bg) || 0) + 1);
    }
    return set;
  };

  const aGrams = bigrams(a);
  const bGrams = bigrams(b);
  let intersection = 0;
  aGrams.forEach((count, gram) => {
    const bCount = bGrams.get(gram);
    if (bCount) intersection += Math.min(count, bCount);
  });
  const total = (a.length - 1) + (b.length - 1);
  return (2 * intersection) / total;
};

const inSameSynonymGroup = (a: string, b: string): boolean => {
  for (const group of SYNONYM_GROUPS) {
    if (group.includes(a) && group.includes(b)) return true;
  }
  return false;
};

/**
 * Compare a candidate's title (or list of titles) against a job title.
 * Returns 0-1 where 1 is a perfect match.
 *
 * Scoring tiers:
 *  - Exact match (after normalization)         → 1.0
 *  - Listed as synonyms                        → 0.9
 *  - One title fully contains the other        → 0.8
 *  - Fuzzy similarity (Dice's coefficient)     → up to ~0.7
 */
export const calculateTitleSimilarity = (
  candidateTitles: string | string[] | null | undefined,
  jobTitle: string | null | undefined
): number => {
  if (!candidateTitles || !jobTitle) return 0;

  const job = normalize(jobTitle);
  const titles = (Array.isArray(candidateTitles) ? candidateTitles : [candidateTitles])
    .filter(Boolean)
    .map(normalize);

  let best = 0;
  for (const t of titles) {
    if (!t) continue;
    if (t === job) return 1;
    if (inSameSynonymGroup(t, job)) { best = Math.max(best, 0.9); continue; }
    if (t.includes(job) || job.includes(t)) { best = Math.max(best, 0.8); continue; }

    const dice = diceCoefficient(t, job);
    // Map Dice 0.5+ to a useful score; below 0.4 we treat as no match.
    if (dice >= 0.7) best = Math.max(best, 0.7);
    else if (dice >= 0.5) best = Math.max(best, 0.5);
    else if (dice >= 0.4) best = Math.max(best, 0.3);
  }
  return best;
};
