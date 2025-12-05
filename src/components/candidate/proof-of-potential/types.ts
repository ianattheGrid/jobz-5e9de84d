export interface ShowAndTellItem {
  title: string;
  type: 'video' | 'image' | 'link';
  url_or_path: string;
  short_description: string;
}

export interface ProofOfPotential {
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
  
  // Block 5: Hobbies & Interests
  hobby_tags?: string[];
  hobby_other?: string | null;
  hobby_to_work_note?: string | null;
  
  // Block 6: Show & Tell (max 3 items)
  show_and_tell_items?: ShowAndTellItem[];
}

export const DEFAULT_PROOF_OF_POTENTIAL: ProofOfPotential = {
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
  hobby_tags: [],
  hobby_other: null,
  hobby_to_work_note: null,
  show_and_tell_items: [],
};
