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
  required_skills: string[] | null;  // Changed to nullable
  match_threshold: number;
  required_qualifications: string[] | null;
  title_essential: boolean | null;
  years_experience_essential: boolean | null;
  min_years_experience: number | null;
  salary_essential: boolean | null;
  skills_essential: boolean | null;
  qualification_essential: boolean | null;
  citizenship_essential: boolean | null;
  required_citizenship: string | null;
}

export interface JobMatch {
  id: number;
  job_id: number | null;
  candidate_id: string | null;
  match_score: number;
  is_notified: boolean | null;
  created_at: string;
}