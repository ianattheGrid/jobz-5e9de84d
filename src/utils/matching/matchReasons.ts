import { explainCandidateMatch, type CandidateSearchCriteria } from "@/components/candidate-search/searchCriteria";

/**
 * Turns a vacancy into the same search criteria an employer would have typed,
 * so a candidate's fit is explained the same way everywhere on Jobz.
 */
export const criteriaFromJob = (job: any): CandidateSearchCriteria => ({
  jobTitle: job?.title || undefined,
  workArea: job?.work_area || undefined,
  itSpecialization: job?.specialization || undefined,
  minSalary: job?.salary_min ?? undefined,
  maxSalary: job?.salary_max ?? undefined,
  minYearsExperience: job?.min_years_experience ?? undefined,
  skills: Array.isArray(job?.required_skills) ? job.required_skills : undefined,
  location: job?.location || undefined,
  qualification: Array.isArray(job?.required_qualifications) ? job.required_qualifications[0] : undefined,
});

/**
 * Two plain sentences saying why this person fits this vacancy, built only from
 * what is already on their profile. Nothing is invented and nothing is stored.
 */
export const matchReasonsForApplication = (candidate: any, job: any): string[] => {
  if (!candidate || !job) return [];
  const { reasons } = explainCandidateMatch(candidate, criteriaFromJob(job));
  return reasons.slice(0, 2);
};
