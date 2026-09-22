/**
 * People usually save postcode areas (BS1, BA2) while vacancies name a town.
 * These helpers treat "BS3" and "Bristol" as the same place so matching is honest.
 */
const TOWN_PREFIXES: Record<string, string[]> = {
  bristol: ["bs"],
  bath: ["ba"],
  gloucester: ["gl"],
  cardiff: ["cf"],
  swindon: ["sn"],
  taunton: ["ta"],
  exeter: ["ex"],
};

const isPostcodeish = (value: string) => /^[a-z]{1,2}\d/i.test(value.trim());

/** True when any of the candidate's places matches the job's location. */
export const locationsOverlap = (
  candidatePlaces: (string | null | undefined)[],
  jobLocation?: string | null
): boolean => {
  if (!jobLocation) return false;
  const pieces = candidatePlaces.filter(Boolean).map((p) => String(p).trim()).filter(Boolean);
  if (pieces.length === 0) return false;

  const wanted = jobLocation.toLowerCase();
  const haystack = pieces.join(" ").toLowerCase();

  if (pieces.some((p) => !isPostcodeish(p) && wanted.includes(p.toLowerCase()))) return true;
  if (haystack.includes(wanted)) return true;

  const prefixes = Object.entries(TOWN_PREFIXES)
    .filter(([town]) => wanted.includes(town))
    .flatMap(([, p]) => p);

  return prefixes.some((prefix) =>
    pieces.some((piece) => isPostcodeish(piece) && piece.toLowerCase().startsWith(prefix))
  );
};
