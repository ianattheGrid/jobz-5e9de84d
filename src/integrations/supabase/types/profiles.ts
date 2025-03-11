
export interface CandidateProfile {
  id: string;
  job_title: string;
  years_experience: number;
  location: string[];
  min_salary: number;
  max_salary: number;
  created_at: string;
  updated_at: string;
  required_skills: string[] | null;
  security_clearance: string | null;
  signup_date: string | null;
  work_eligibility: string | null;
  commission_percentage: number | null;
  preferred_work_type: string | null;
  additional_skills: string | null;
  desired_job_title: string | null;
  availability: string | null;
  full_name: string | null;
  email: string;
  phone_number: string | null;
  address: string | null;
  profile_picture_url: string | null;
  cv_url: string | null;
  work_preferences: string | null;
  travel_radius: number | null;
  current_employer: string | null;
  ai_synopsis: string | null;
  ai_synopsis_status: string | null;
  ai_synopsis_last_updated: string | null;
  home_postcode: string | null;
  linkedin_url: string | null;
}
