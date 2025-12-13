import { ReferenceEntry } from "@/integrations/supabase/types/profiles";

export interface ShowAndTellItem {
  title: string;
  type: 'video' | 'image' | 'link';
  url_or_path: string;
  short_description: string;
}

export interface HobbyEntry {
  id: string;
  hobby_type: string;
  hobby_detail?: string | null;
  skills_demonstrated?: string | null;
}

export interface GettingStartedData {
  // Entry-level essentials
  first_job_salary_min?: number | null;
  first_job_salary_max?: number | null;
  first_job_availability?: string | null;
  first_job_work_type?: string | null;
  looking_for_work_reasons?: string[];
  
  // Block 1: My Work Style (max 4 selections)
  work_style_tags?: string[];
  
  // Block 2: Things I've Done
  experience_context_tags?: string[];
  experience_context_other?: string | null;
  experience_proud_of?: string | null;
  
  // Block 3: Reliability & Availability
  reliability_tags?: string[];
  preferred_time_of_day?: 'morning' | 'afternoon' | 'evening' | 'flexible';
  weekend_ok?: boolean;
  
  // Block 4: My Next Chapter
  next_chapter_sectors?: string[];
  next_chapter_sectors_other?: string | null;
  next_chapter_text?: string | null;
  
  // Block 5: Hobbies & Interests (enhanced with context)
  hobby_entries?: HobbyEntry[];
  hobby_other?: string | null;
  hobby_to_work_note?: string | null;
  // Legacy field for backwards compatibility
  hobby_tags?: string[];
  
  // Block 6: Show & Tell (max 3 items)
  show_and_tell_items?: ShowAndTellItem[];
  
  // Block 7: References (optional)
  references?: ReferenceEntry[];
}

export const DEFAULT_GETTING_STARTED_DATA: GettingStartedData = {
  first_job_salary_min: null,
  first_job_salary_max: null,
  first_job_availability: null,
  first_job_work_type: null,
  looking_for_work_reasons: [],
  work_style_tags: [],
  experience_context_tags: [],
  experience_context_other: null,
  experience_proud_of: null,
  reliability_tags: [],
  preferred_time_of_day: 'flexible',
  weekend_ok: false,
  next_chapter_sectors: [],
  next_chapter_sectors_other: null,
  next_chapter_text: null,
  hobby_entries: [],
  hobby_tags: [],
  hobby_other: null,
  hobby_to_work_note: null,
  show_and_tell_items: [],
  references: [],
};

// Entry-level salary options (£10K-£38K in £2K increments)
export const ENTRY_LEVEL_SALARY_OPTIONS = [
  { value: 10000, label: "£10,000" },
  { value: 12000, label: "£12,000" },
  { value: 14000, label: "£14,000" },
  { value: 16000, label: "£16,000" },
  { value: 18000, label: "£18,000" },
  { value: 20000, label: "£20,000" },
  { value: 22000, label: "£22,000" },
  { value: 24000, label: "£24,000" },
  { value: 26000, label: "£26,000" },
  { value: 28000, label: "£28,000" },
  { value: 30000, label: "£30,000" },
  { value: 32000, label: "£32,000" },
  { value: 34000, label: "£34,000" },
  { value: 36000, label: "£36,000" },
  { value: 38000, label: "£38,000" },
];

export const FIRST_JOB_AVAILABILITY_OPTIONS = [
  { value: 'immediately', label: "Immediately" },
  { value: '1-2-weeks', label: "1-2 weeks" },
  { value: 'after-exams', label: "After exams/graduation" },
  { value: 'next-month', label: "Next month" },
  { value: 'flexible', label: "Flexible - depends on the role" },
];

export const FIRST_JOB_WORK_TYPE_OPTIONS = [
  { value: 'full-time', label: "Full-time" },
  { value: 'part-time', label: "Part-time" },
  { value: 'flexible', label: "Flexible hours" },
  { value: 'temporary', label: "Temporary/Seasonal" },
  { value: 'apprenticeship', label: "Apprenticeship" },
];

export const LOOKING_FOR_WORK_REASONS = [
  { key: 'finished-school', label: "Finished school/sixth form" },
  { key: 'finished-university', label: "Finished university" },
  { key: 'gap-year', label: "Gap year" },
  { key: 'left-previous-job', label: "Left previous job" },
  { key: 'need-income-studying', label: "Need income while studying" },
  { key: 'gain-experience', label: "Want to gain experience" },
  { key: 'career-change', label: "Looking for a new direction" },
];
