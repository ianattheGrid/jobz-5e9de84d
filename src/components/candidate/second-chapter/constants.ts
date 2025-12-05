/**
 * Second Chapter Constants
 * All options for the Second Chapter profile section
 */

// Character limits
export const CHAR_LIMITS = {
  sectors_other: 60,
  sector_note: 200,
  role_shape_other: 80,
  team_contribution_other: 80,
  environment_other: 80,
  summary: 250,
} as const;

// Block 1: Sector Options
export const SECOND_CHAPTER_SECTOR_OPTIONS = [
  { value: 'education_training', label: 'Education & Training' },
  { value: 'hospitality', label: 'Hospitality (cafés, bars, restaurants, hotels)' },
  { value: 'retail', label: 'Retail (shops, supermarkets, customer service)' },
  { value: 'travel_tourism', label: 'Travel & Tourism' },
  { value: 'engineering_technical', label: 'Engineering & Technical' },
  { value: 'construction_trades', label: 'Construction & Trades' },
  { value: 'warehousing_logistics', label: 'Warehousing & Logistics' },
  { value: 'office_admin', label: 'Office/Admin & Organising' },
  { value: 'tech_it', label: 'Tech / IT (support, software, data, etc.)' },
  { value: 'creative_media', label: 'Creative & Media (content, design, marketing, music, etc.)' },
  { value: 'care_support', label: 'Care / Support Work' },
  { value: 'nonprofit_charity', label: 'Non-profit / Charity' },
  { value: 'public_sector', label: 'Public Sector / Government' },
  { value: 'consulting_advisory', label: 'Consulting / Advisory' },
  { value: 'driving_delivery', label: 'Driving & Delivery' },
  { value: 'outdoor_environment', label: 'Outdoor / Environment / Landscaping' },
] as const;

export const SECTOR_TRANSITION_OPTIONS = [
  { 
    value: 'stay_same_sector_new_role', 
    label: "I'd like to stay in the same sector but move into a different type of role" 
  },
  { 
    value: 'new_sector', 
    label: "I'd like to explore a new sector" 
  },
  { 
    value: 'either', 
    label: "I'm open to either" 
  },
] as const;

// Block 2: Role Shape Options
export const ROLE_SHAPE_OPTIONS = [
  { 
    value: 'use_experience_no_management', 
    label: 'Use my experience without being in a formal management role' 
  },
  { 
    value: 'support_mentor', 
    label: 'Support or mentor others (without being their manager)' 
  },
  { 
    value: 'leadership_management', 
    label: 'Take on a leadership or management role' 
  },
  { 
    value: 'people_facing', 
    label: 'Focus on working directly with people (students, customers, clients, service users)' 
  },
  { 
    value: 'hands_on', 
    label: 'Do more hands-on work' 
  },
  { 
    value: 'behind_scenes', 
    label: 'Do more organising / planning / admin behind the scenes' 
  },
  { 
    value: 'project_work', 
    label: 'Work on specific projects or initiatives' 
  },
  { 
    value: 'advisory_consulting', 
    label: 'Move into a more advisory or consulting-type role' 
  },
] as const;

// Block 3: Team Contribution Options
export const TEAM_CONTRIBUTION_OPTIONS = [
  { 
    value: 'reliable_day_to_day', 
    label: 'Being someone others can rely on day-to-day' 
  },
  { 
    value: 'own_area_responsibility', 
    label: 'Taking responsibility for my own area and doing it well' 
  },
  { 
    value: 'train_buddy', 
    label: 'Helping train or buddy new people' 
  },
  { 
    value: 'calm_under_pressure', 
    label: "Keeping things calm when it's busy or stressful" 
  },
  { 
    value: 'handle_tricky', 
    label: 'Handling tricky or sensitive situations' 
  },
  { 
    value: 'share_experience', 
    label: "Sharing what I've learned over the years with others" 
  },
  { 
    value: 'lead_team', 
    label: 'Leading a team or department' 
  },
  { 
    value: 'plan_coordinate', 
    label: 'Planning or coordinating work for others' 
  },
  { 
    value: 'build_relationships', 
    label: 'Building strong relationships with clients/customers/partners' 
  },
] as const;

// Block 4: Environment Options
export const ENVIRONMENT_OPTIONS = [
  { 
    value: 'fast_paced', 
    label: "I'm happy in a fast-paced environment" 
  },
  { 
    value: 'steady_pace', 
    label: 'I prefer a steady, consistent pace most of the time' 
  },
  { 
    value: 'clear_goals', 
    label: 'I like having clear goals and responsibilities' 
  },
  { 
    value: 'variety_change', 
    label: 'I enjoy variety and change' 
  },
  { 
    value: 'collaborative', 
    label: 'I like a collaborative, team-focused culture' 
  },
  { 
    value: 'independent', 
    label: "I'm comfortable working independently" 
  },
  { 
    value: 'people_most_of_day', 
    label: "I'm happy dealing with people most of the day" 
  },
  { 
    value: 'behind_scenes_env', 
    label: 'I prefer more behind-the-scenes work' 
  },
] as const;

// Block 4: Work Structure Options
export const WORK_STRUCTURE_OPTIONS = [
  { 
    value: 'full_time', 
    label: 'Full-time, standard hours' 
  },
  { 
    value: 'part_time', 
    label: 'Part-time' 
  },
  { 
    value: 'project_contract', 
    label: 'Project-based / contract work' 
  },
  { 
    value: 'hybrid_remote', 
    label: 'Hybrid or remote work options' 
  },
  { 
    value: 'no_overnight', 
    label: 'No regular very late night or overnight shifts' 
  },
] as const;

// Helper function to get label from value
export function getLabelForValue(
  options: readonly { value: string; label: string }[],
  value: string
): string {
  const option = options.find(o => o.value === value);
  return option?.label || value;
}

// Helper to format multiple values as a readable list
export function formatTagsAsLabels(
  options: readonly { value: string; label: string }[],
  values: string[] | undefined
): string[] {
  if (!values) return [];
  return values.map(v => getLabelForValue(options, v));
}
