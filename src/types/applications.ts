
import { Json } from "@/integrations/supabase/types/common";
import { VRRecommendation } from "./recommendations";

export interface Application {
  id: number;
  job_id: number;
  applicant_id: string;
  status: string;
  resume_url: string | null;
  cover_letter: string | null;
  created_at: string;
  updated_at: string;
  employer_accepted: boolean | null;
  candidate_accepted: boolean | null;
  employer_viewed_at: string | null;
  candidate_viewed_at: string | null;
  profile_visibility_enabled: boolean | null;
}

export interface ApplicationWithDetails {
  id: number;
  jobs: {
    title: string;
    employer_id: string;
  };
  candidate_profiles: {
    job_title: string;
    years_experience: number;
  } | null;
  vrRecommendation?: VRRecommendation;
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
