
export interface CandidateProfile {
  id: string;
  email: string;
  job_title: string;
  years_experience: number;
  location: string[];
  min_salary: number;
  max_salary: number;
  required_qualifications: string[] | null;
  required_skills: string[] | null;
  security_clearance: string | null;
  commission_percentage: number | null;
  created_at: string;
  updated_at: string;
  signup_date: string | null;
  work_eligibility: string | null;
  preferred_work_type: string | null;
  availability: string | null;
  additional_skills: string | null;
  address: string | null;
  ai_synopsis: string | null;
  ai_synopsis_last_updated: string | null;
  ai_synopsis_status: string | null;
  current_employer: string | null;
  cv_url: string | null;
  full_name: string | null;
  phone_number: string | null;
  profile_picture_url: string | null;
  travel_radius: number | null;
  work_preferences: string | null;
  desired_job_title: string | null;
  home_postcode: string | null;
  linkedin_url: string | null;
}

