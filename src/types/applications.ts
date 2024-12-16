import { Application } from "@/integrations/supabase/types/applications";

export interface ApplicationWithDetails extends Omit<Application, 'candidate_profiles'> {
  jobs: {
    title: string;
    employer_id: string;
  };
  candidate_profiles: {
    job_title: string;
    years_experience: number;
  } | null;
}