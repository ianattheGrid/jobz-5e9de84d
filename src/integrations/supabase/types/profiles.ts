export interface ShowAndTellItem {
  title: string;
  type: 'video' | 'image' | 'link';
  url_or_path: string;
  short_description: string;
}

export interface ProofOfPotential {
  work_style_tags?: string[];
  experience_context_tags?: string[];
  experience_context_other?: string | null;
  experience_proud_of?: string | null;
  reliability_tags?: string[];
  preferred_time_of_day?: 'morning' | 'afternoon' | 'evening' | 'flexible';
  weekend_ok?: boolean;
  next_chapter_sectors?: string[];
  next_chapter_sectors_other?: string | null;
  next_chapter_text?: string | null;
  hobby_tags?: string[];
  hobby_other?: string | null;
  hobby_to_work_note?: string | null;
  show_and_tell_items?: ShowAndTellItem[];
}

export type SectorTransitionType = 'stay_same_sector_new_role' | 'new_sector' | 'either';

export interface SecondChapter {
  // Block 1: Sectors for My Second Chapter
  second_chapter_sectors?: string[];
  second_chapter_sectors_other?: string | null;
  sector_transition_type?: SectorTransitionType;
  second_chapter_sector_note?: string | null;
  
  // Block 2: Role Shape
  second_chapter_role_shape_tags?: string[];
  second_chapter_role_shape_other?: string | null;
  
  // Block 3: Team Contribution
  second_chapter_team_contribution_tags?: string[];
  second_chapter_team_contribution_other?: string | null;
  
  // Block 4: Environment & Structure
  second_chapter_environment_tags?: string[];
  second_chapter_work_structure_tags?: string[];
  second_chapter_environment_other?: string | null;
  
  // Block 5: In My Own Words
  second_chapter_summary?: string | null;
}

// Career Stage Types
export type CareerStageType = 'launchpad' | 'ascent' | 'core' | 'pivot' | 'encore';

export interface UnavailablePeriod {
  start: string;
  end: string;
}

export interface AscentProfile {
  // To be defined in Phase 3
  [key: string]: any;
}

export interface CoreProfile {
  // To be defined in Phase 3
  [key: string]: any;
}

export interface EncoreProfile {
  // To be defined in Phase 3
  [key: string]: any;
}

export interface CandidateProfile {
  id: string;
  email: string;
  job_title: string[] | string | null;
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
  years_in_current_title: number | null;
  title_experience?: string | null;
  workArea: string | null;
  itSpecialization: string | null;
  personality?: any;
  proof_of_potential?: ProofOfPotential | any | null;
  show_proof_of_potential?: boolean;
  second_chapter?: SecondChapter | any | null;
  show_second_chapter?: boolean;
  personal_statement?: string | null;
  contact_jobz_ok?: boolean | null;
  
  // New True Core fields
  date_of_birth?: string | null;
  has_uk_driving_license?: boolean;
  can_drive?: boolean;
  unavailable_dates?: UnavailablePeriod[] | any | null;
  
  // Career Stage fields
  primary_career_stage?: CareerStageType | string | null;
  secondary_career_stages?: CareerStageType[] | string[] | null;
  
  // Stage-specific profiles
  ascent_profile?: AscentProfile | any | null;
  core_profile?: CoreProfile | any | null;
  encore_profile?: EncoreProfile | any | null;
  show_ascent_profile?: boolean;
  show_core_profile?: boolean;
  show_encore_profile?: boolean;
}

export interface EmployerProfile {
  id: string;
  company_logo_url: string | null;
  company_name: string;
  company_website: string | null;
  created_at: string;
  full_name: string;
  job_title: string;
  linkedin_url: string | null;
  profile_picture_url: string | null;
  updated_at: string;
}

export interface RecruiterProfile {
  id: string;
  created_at: string;
  updated_at: string;
  is_probation: boolean | null;
  experience_years: number;
  verification_status: string;
  rating: number | null;
  successful_placements: number | null;
  full_name: string;
}

export interface VirtualRecruiterProfile {
  id: string;
  vr_number: string;
  location: string;
  email: string;
  full_name: string;
  bank_account_details: any | null;
  bank_account_verified: boolean | null;
  successful_placements: number | null;
  recommendations_count: number | null;
  is_active: boolean | null;
  updated_at: string;
  created_at: string;
  national_insurance_number: string | null;
}
