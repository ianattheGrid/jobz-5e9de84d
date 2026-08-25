import { calculateTitleSimilarity } from "@/components/job-card/utils/titleMatching";

/**
 * Structured criteria used by both the classic filter form and the
 * natural-language ("smart") search. Every field is optional so a recruiter can
 * search with as little or as much detail as they like.
 */
export interface CandidateSearchCriteria {
  jobTitle?: string;
  workArea?: string;
  itSpecialization?: string;
  minSalary?: number;
  maxSalary?: number;
  minYearsExperience?: number;
  skills?: string[];
  location?: string;
  workPreference?: string;
  securityClearance?: string;
  qualification?: string;
  commissionOnly?: boolean;
  signupPeriod?: string;
}

export interface MatchExplanation {
  score: number;
  reasons: string[];
  gaps: string[];
}

const formatSalary = (value?: number | null) =>
  typeof value === "number" ? `£${value.toLocaleString()}` : "";

const asArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter(Boolean).map(String) : value ? [String(value)] : [];

/**
 * Explain why a candidate does (or doesn't) fit the recruiter's criteria.
 * Mirrors the candidate-side match explanation so both sides see the same logic.
 */
export const explainCandidateMatch = (
  candidate: any,
  criteria: CandidateSearchCriteria
): MatchExplanation => {
  const reasons: string[] = [];
  const gaps: string[] = [];
  const parts: number[] = [];

  // Title
  if (criteria.jobTitle) {
    const titles = [candidate.job_title, candidate.desired_job_title].filter(Boolean);
    const similarity = calculateTitleSimilarity(titles as string[], criteria.jobTitle);
    parts.push(similarity);
    if (similarity >= 0.8) {
      reasons.push(`Title matches "${criteria.jobTitle}"`);
    } else if (similarity >= 0.4) {
      reasons.push(`Similar title (${candidate.job_title})`);
    } else {
      gaps.push(`Title is ${candidate.job_title || "unspecified"}, not ${criteria.jobTitle}`);
    }
  }

  // Work area
  if (criteria.workArea) {
    const match = String(candidate.workArea || "").toLowerCase() === criteria.workArea.toLowerCase();
    parts.push(match ? 1 : 0);
    if (match) reasons.push(`Works in ${criteria.workArea}`);
    else gaps.push(`Not in ${criteria.workArea}`);
  }

  // Specialisation
  if (criteria.itSpecialization) {
    const match = String(candidate.itSpecialization || "")
      .toLowerCase()
      .includes(criteria.itSpecialization.toLowerCase());
    parts.push(match ? 1 : 0);
    if (match) reasons.push(`Specialises in ${criteria.itSpecialization}`);
    else gaps.push(`No ${criteria.itSpecialization} specialisation listed`);
  }

  // Salary overlap
  if (criteria.minSalary != null || criteria.maxSalary != null) {
    const min = criteria.minSalary ?? 0;
    const max = criteria.maxSalary ?? Number.MAX_SAFE_INTEGER;
    const cMin = candidate.min_salary ?? 0;
    const cMax = candidate.max_salary ?? Number.MAX_SAFE_INTEGER;
    const overlaps = cMin <= max && cMax >= min;
    parts.push(overlaps ? 1 : 0);
    if (overlaps) {
      reasons.push(`Salary expectation fits your range${criteria.maxSalary ? ` (up to ${formatSalary(criteria.maxSalary)})` : ""}`);
    } else {
      gaps.push(`Expects ${formatSalary(candidate.min_salary)} - ${formatSalary(candidate.max_salary)}`);
    }
  }

  // Experience
  if (criteria.minYearsExperience != null) {
    const years = candidate.years_experience ?? 0;
    const ok = years >= criteria.minYearsExperience;
    parts.push(ok ? 1 : Math.min(1, years / Math.max(1, criteria.minYearsExperience)));
    if (ok) reasons.push(`${years} years experience (needs ${criteria.minYearsExperience}+)`);
    else gaps.push(`Only ${years} years experience, you asked for ${criteria.minYearsExperience}+`);
  }

  // Skills
  if (criteria.skills && criteria.skills.length > 0) {
    const candidateSkills = [
      ...asArray(candidate.required_skills),
      ...asArray(candidate.additional_skills ? String(candidate.additional_skills).split(",") : []),
    ].map((s) => s.trim().toLowerCase());

    const matched = criteria.skills.filter((skill) =>
      candidateSkills.some((cs) => cs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(cs))
    );
    const missing = criteria.skills.filter((s) => !matched.includes(s));
    parts.push(matched.length / criteria.skills.length);
    if (matched.length) reasons.push(`Has ${matched.join(", ")}`);
    if (missing.length) gaps.push(`Missing ${missing.join(", ")}`);
  }

  // Location
  if (criteria.location) {
    const haystack = [
      ...asArray(candidate.location),
      candidate.address,
      candidate.home_postcode,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    const match = haystack.includes(criteria.location.toLowerCase());
    parts.push(match ? 1 : 0);
    if (match) reasons.push(`Based near ${criteria.location}`);
    else gaps.push(`Location not confirmed as ${criteria.location}`);
  }

  // Work preference
  if (criteria.workPreference) {
    const pref = [candidate.preferred_work_type, candidate.work_preferences]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    const match = pref.includes(criteria.workPreference.toLowerCase());
    parts.push(match ? 1 : 0.5);
    if (match) reasons.push(`Open to ${criteria.workPreference} work`);
  }

  // Security clearance
  if (criteria.securityClearance) {
    const match =
      String(candidate.security_clearance || "").toLowerCase() ===
      criteria.securityClearance.toLowerCase();
    parts.push(match ? 1 : 0);
    if (match) reasons.push(`Holds ${criteria.securityClearance} clearance`);
    else gaps.push(`No ${criteria.securityClearance} clearance on file`);
  }

  // Qualification
  if (criteria.qualification) {
    const quals = asArray(candidate.required_qualifications).join(" ").toLowerCase();
    const match = quals.includes(criteria.qualification.toLowerCase());
    parts.push(match ? 1 : 0);
    if (match) reasons.push(`Qualified: ${criteria.qualification}`);
    else gaps.push(`No ${criteria.qualification} listed`);
  }

  if (candidate.commission_percentage) {
    reasons.push(`Offers a ${candidate.commission_percentage}% "You're Hired" bonus`);
  }

  const score = parts.length
    ? Math.round((parts.reduce((a, b) => a + b, 0) / parts.length) * 100)
    : 0;

  return { score, reasons, gaps };
};

/** Human-readable summary of the criteria, used for the filter chips. */
export const describeCriteria = (criteria: CandidateSearchCriteria): { label: string; value: string }[] => {
  const chips: { label: string; value: string }[] = [];
  if (criteria.jobTitle) chips.push({ label: "Title", value: criteria.jobTitle });
  if (criteria.workArea) chips.push({ label: "Area", value: criteria.workArea });
  if (criteria.itSpecialization) chips.push({ label: "Specialism", value: criteria.itSpecialization });
  if (criteria.location) chips.push({ label: "Location", value: criteria.location });
  if (criteria.minSalary != null || criteria.maxSalary != null) {
    chips.push({
      label: "Salary",
      value: `${formatSalary(criteria.minSalary) || "any"} - ${formatSalary(criteria.maxSalary) || "any"}`,
    });
  }
  if (criteria.minYearsExperience != null)
    chips.push({ label: "Experience", value: `${criteria.minYearsExperience}+ years` });
  if (criteria.skills?.length) chips.push({ label: "Skills", value: criteria.skills.join(", ") });
  if (criteria.workPreference) chips.push({ label: "Work style", value: criteria.workPreference });
  if (criteria.securityClearance) chips.push({ label: "Clearance", value: criteria.securityClearance });
  if (criteria.qualification) chips.push({ label: "Qualification", value: criteria.qualification });
  if (criteria.commissionOnly) chips.push({ label: "Bonus", value: "Offers a bonus" });
  return chips;
};
