import { Json } from "./common";

export interface CandidateProfile {
  id: string;
  job_title: string;
  years_experience: number;
  location: string;
  min_salary: number;
  max_salary: number;
  created_at: string;
  updated_at: string;
  required_skills: string[] | null;
  security_clearance: string | null;
  signup_date: string | null;
  work_eligibility: string | null;
  commission_percentage: number | null;
  preferred_work_type: string | null;  // Added this field
  additional_skills: string | null;  // Added this field
}

export interface EmployerProfile {
  id: string;
  company_name: string;
  full_name: string;
  job_title: string;
  created_at: string;
  updated_at: string;
}

export interface RecruiterProfile {
  id: string;
  full_name: string;
  experience_years: number;
  verification_status: string;
  rating: number | null;
  successful_placements: number | null;
  is_probation: boolean | null;
  created_at: string;
  updated_at: string;
}