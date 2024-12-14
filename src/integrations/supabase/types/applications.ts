import { Json } from "./common";

export interface Application {
  id: number;
  job_id: number;
  applicant_id: string;
  status: string;
  resume_url: string | null;
  cover_letter: string | null;
  created_at: string;
  updated_at: string;
}

export interface Interview {
  id: number;
  job_id: number;
  candidate_id: string;
  employer_id: string;
  interviewer_name: string;
  scheduled_at: string;
  status: string;
  created_at: string;
  updated_at: string;
}