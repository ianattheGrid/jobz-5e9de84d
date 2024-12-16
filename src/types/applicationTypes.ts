export interface CandidateData {
  job_title: string;
  years_experience: number;
}

export interface ApplicationResponse {
  id: number;
  jobs: {
    title: string;
    employer_id: string;
  };
  applicant_id: string;
  candidate_profiles: CandidateData | null;
}

export interface ApplicationWithDetails {
  id: number;
  jobs: {
    title: string;
    employer_id: string;
  };
  candidate_profiles: CandidateData | null;
}