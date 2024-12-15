import { Json } from "./common";

export interface Job {
  id: number;
  title: string;
  description: string;
  company: string;
  location: string;
  salary_min: number;
  salary_max: number;
  candidate_commission: number | null;
  type: string;
  created_at: string;
  holiday_entitlement: number | null;
  company_benefits: string | null;
  employer_id: string | null;
  required_skills: string[] | null;  // Ensure this is included
  match_threshold: number;
}

export interface JobMatch {
  id: number;
  job_id: number | null;
  candidate_id: string | null;
  match_score: number;
  is_notified: boolean | null;
  created_at: string;
}