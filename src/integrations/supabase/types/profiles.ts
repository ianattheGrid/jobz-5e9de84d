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

// Career Break Types
export interface CareerBreak {
  id: string;
  break_type: string[];
  break_type_other?: string | null;
  break_start_date: string; // YYYY-MM format
  break_end_date: string; // YYYY-MM format
  break_gains_description: string;
  return_readiness: 'immediate' | 'within_1_3_months' | 'within_3_6_months' | 'flexible';
  return_type_preference: string[];
}

// Accessibility Info Types
export interface AccessibilityInfo {
  enabled?: boolean;
  workplace_adjustments?: string[];
  workplace_adjustments_other?: string | null;
  preferred_work_environment_traits?: string[];
  preferred_work_environment_traits_other?: string | null;
  accessibility_additional_info?: string | null;
  accessibility_visibility?: 'always' | 'in_conversation_only';
}

// Ascent Profile Types
export interface WorkExperienceEntry {
  id: string;
  role_title: string;
  organisation_name: string;
  role_start_date: string; // YYYY-MM
  role_end_date: string; // YYYY-MM or 'current'
  role_simple_summary: string; // max 100 chars
  role_main_responsibilities: string; // max 200 chars
  role_challenge_handled?: string | null; // max 200 chars
  role_proud_of?: string | null; // max 200 chars
}

export interface ReferenceEntry {
  id: string;
  ref_name: string;
  ref_relationship: string; // e.g., "Store Manager"
  ref_contact: string; // email or phone
  ref_snippet?: string | null; // max 200 chars - what they'd say
}

export interface HobbyEntry {
  id: string;
  hobby_type: string; // from HOBBY_OPTIONS
  hobby_detail?: string | null; // max 120 chars
  skills_demonstrated?: string | null; // max 100 chars
}

export interface AscentProfile {
  // Section 1: Direction & Sectors
  current_sector_experience?: string[];
  sectors_interested_next?: string[];
  direction_note?: string | null; // max 150 chars
  
  // Section 2: Work Experience (repeatable)
  work_experience_entries?: WorkExperienceEntry[];
  
  // Section 3: Skills
  work_skills?: string[]; // max 8 selections
  tools_or_systems?: string | null; // max 150 chars
  
  // Section 4: Work Style Evolution
  work_style_growth_tags?: string[];
  work_style_growth_other?: string | null; // max 80 chars
  
  // Section 5: More Of / Less Of
  next_role_more_of_tags?: string[];
  next_role_more_of_other?: string | null; // max 80 chars
  next_role_less_of_tags?: string[];
  next_role_less_of_other?: string | null; // max 80 chars
  
  // Section 6: About Me & Outside Work
  about_me_short?: string | null; // max 200 chars
  outside_work_proud_of?: string | null; // max 150 chars
  hobby_entries?: HobbyEntry[];
  
  // Section 7: Next Step Up
  next_step_type_tags?: string[];
  next_step_other?: string | null; // max 80 chars
  next_step_note?: string | null; // max 150 chars
  
  // Section 8: References (repeatable)
  references?: ReferenceEntry[];
}

// Core Experience Entry (more detailed than Ascent)
export interface CoreExperienceEntry {
  id: string;
  role_title: string;
  organisation_name: string;
  role_start_date: string; // YYYY-MM
  role_end_date: string; // YYYY-MM or 'current'
  role_summary: string; // max 220 chars - "What was this job for?"
  role_team_size?: string | null; // max 60 chars
  role_budget_responsibility?: string | null; // max 80 chars
  role_scope?: string | null; // max 120 chars
  role_key_impacts: string[]; // 2-4 items, each max 140 chars
}

// Core Reference Entry (extended with role title)
export interface CoreReferenceEntry {
  id: string;
  ref_name: string;
  ref_role_title: string; // e.g., "Store Manager"
  ref_relationship: string; // e.g., "Former Line Manager"
  ref_contact?: string | null; // email or phone
  ref_snippet?: string | null; // max 250 chars
}

export interface CoreProfile {
  // Section 1: Snapshot
  current_role_title?: string | null;
  current_sector?: string | null;
  years_experience_range?: string | null; // e.g., "5-7", "7-10", "10-15", "15-20", "20+"
  core_strength_tags?: string[]; // 3-5 selections

  // Section 2: Experience (repeatable)
  experience_entries?: CoreExperienceEntry[];

  // Section 3: Work I'm Best At
  core_work_focus_tags?: string[]; // 3-6 selections
  one_thing_i_do_really_well?: string | null; // max 150 chars

  // Section 4: Things I'm Proud Of
  proud_moments?: string[]; // 2-4 items, each max 200 chars

  // Section 5: How I Lead & Contribute
  leadership_contribution_tags?: string[];
  leadership_note?: string | null; // max 150 chars

  // Section 6: What I Want Next
  next_role_direction_tags?: string[];
  next_role_more_of_tags?: string[];
  next_role_less_of_tags?: string[];
  next_role_note?: string | null; // max 200 chars

  // Section 7: Work Preferences
  preferred_work_environment_tags?: string[];
  work_structure_tags?: string[];

  // Section 8: Outside Work
  outside_work_summary?: string | null; // max 200 chars
  volunteering_or_side_projects?: string[]; // each max 120 chars

  // Section 9: Recommendations (repeatable)
  recommendations?: CoreReferenceEntry[];
}

export interface EncoreProfile {
  // To be defined in Phase 3
  [key: string]: any;
}

// Pivot Experience Entry (simplified)
export interface PivotExperienceEntry {
  id: string;
  role_title: string;
  organisation_name: string;
  role_start_date: string; // YYYY-MM
  role_end_date: string; // YYYY-MM or 'current'
  role_brief_context: string; // max 150 chars
  role_key_achievements_transferable: string[]; // 1-2 items, each max 140 chars
}

export type PivotType = 'internal' | 'external';

export interface PivotProfile {
  // Section 1: My Pivot Story
  pivot_type?: PivotType | null;
  target_sectors?: string[]; // 1-3 from SECTOR_OPTIONS
  target_role_types?: string[]; // 1-3 free text
  pivot_motivation?: string | null; // max 350 chars

  // Section 2: Transferable Strengths
  top_transferable_skills?: string[]; // 3-6 selections
  transferable_skills_examples?: string[]; // 2-4 items, each max 200 chars

  // Section 3: Proactive Steps
  pivot_preparation_activities?: string[];
  pivot_preparation_details?: string | null; // max 300 chars

  // Section 4: Professional Journey (2-3 roles)
  professional_journey?: PivotExperienceEntry[];

  // Section 5: What I'm Looking For
  new_role_more_of_tags?: string[];
  new_role_less_of_tags?: string[];
  new_role_note?: string | null; // max 200 chars

  // Section 6: Work Preferences
  preferred_work_environment_tags?: string[];
  work_structure_tags?: string[];

  // Section 7: Recommendations
  recommendations?: CoreReferenceEntry[];
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
  pivot_profile?: PivotProfile | any | null;
  encore_profile?: EncoreProfile | any | null;
  show_ascent_profile?: boolean;
  show_core_profile?: boolean;
  show_pivot_profile?: boolean;
  show_encore_profile?: boolean;
  
  // Career Breaks & Accessibility
  career_breaks?: CareerBreak[] | any | null;
  accessibility_info?: AccessibilityInfo | any | null;
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
