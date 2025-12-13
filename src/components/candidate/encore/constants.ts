// Reuse from other modules
export { SECTOR_OPTIONS } from '../getting-started/constants';
export { YEARS_EXPERIENCE_OPTIONS } from '../core/constants';

// Encore Mode Options (Section 1)
export const ENCORE_MODE_OPTIONS = [
  { key: 'full_time', label: "I'm looking for a full-time role" },
  { key: 'part_time', label: "I'm open to part-time or reduced hours" },
  { key: 'simpler_role', label: "I'd like something simpler / less intense than my last role" },
  { key: 'mentoring_advisory', label: "I'd like to use my experience to support others (mentoring / training / advisory)" },
  { key: 'project_short_term', label: "I'm open to short-term or project work" },
];

// Primary Career Areas (Section 3)
export const PRIMARY_CAREER_AREA_OPTIONS = [
  { key: 'operations', label: 'Operations' },
  { key: 'sales', label: 'Sales' },
  { key: 'finance', label: 'Finance' },
  { key: 'hr', label: 'HR / People' },
  { key: 'tech', label: 'Tech / IT' },
  { key: 'education', label: 'Education / Training' },
  { key: 'healthcare', label: 'Healthcare / Care' },
  { key: 'marketing', label: 'Marketing / Communications' },
  { key: 'customer_service', label: 'Customer Service' },
  { key: 'logistics', label: 'Logistics / Supply Chain' },
  { key: 'management', label: 'General Management' },
  { key: 'retail', label: 'Retail' },
  { key: 'hospitality', label: 'Hospitality' },
];

// Encore Value Tags (Section 4)
export const ENCORE_VALUE_OPTIONS = [
  { key: 'running_team', label: 'Running a team or department day-to-day' },
  { key: 'stabilising', label: 'Stabilising or improving under-performing areas' },
  { key: 'training_onboarding', label: 'Training and onboarding new staff' },
  { key: 'mentoring', label: 'Mentoring younger or less experienced colleagues' },
  { key: 'complex_customer', label: 'Handling complex customer or client situations' },
  { key: 'reliability_consistency', label: 'Bringing structure, reliability and consistency' },
  { key: 'covering_gaps', label: 'Covering key person / holiday gaps' },
  { key: 'sector_knowledge', label: 'Bringing deep sector knowledge and contacts' },
  { key: 'process_improvement', label: 'Helping design or improve processes' },
  { key: 'other', label: 'Other (specify)' },
];

// Responsibility Level Options (Section 5)
export const RESPONSIBILITY_LEVEL_OPTIONS = [
  { key: 'similar', label: 'Happy with a similar level of responsibility to my last role' },
  { key: 'step_down', label: 'Prefer a step down to a simpler role with less responsibility' },
  { key: 'advisory', label: 'Prefer more of an advisory/mentoring focus rather than full line management' },
];

// Work Hours Preferences (Section 6)
export const WORK_HOURS_OPTIONS = [
  { key: 'full_time', label: 'Full-time' },
  { key: '3_4_days', label: '3–4 days per week' },
  { key: '1_2_days', label: '1–2 days per week' },
  { key: 'short_term', label: 'Short-term contracts or projects' },
  { key: 'seasonal', label: 'Seasonal / peak-period work only' },
];

// Pace Preferences (Section 6)
export const PACE_PREFERENCE_OPTIONS = [
  { key: 'fast_paced', label: 'Fast-paced, high-energy environment is fine' },
  { key: 'steady', label: 'Prefer a steady, predictable pace' },
  { key: 'mixed', label: 'Happy with a mix of busy and quiet periods' },
];

// Character Limits
export const ENCORE_CHAR_LIMITS = {
  encore_summary: 250,
  sector_shift_note: 150,
  career_headline: 200,
  encore_value_other: 80,
  encore_value_note: 150,
  proud_moment: 220,
  role_brief_context: 150,
  role_key_impact: 140,
  life_balance_notes: 200,
};

// Selection limits
export const MAX_ENCORE_MODES = 5;
export const MAX_ENCORE_VALUE_TAGS = 6;
export const MIN_ENCORE_VALUE_TAGS = 3;
export const MAX_PROUD_MOMENTS = 3;
export const MIN_PROUD_MOMENTS = 2;
export const MAX_ROLE_TYPES = 5;
export const MAX_EXPERIENCE_ENTRIES = 4;
export const MAX_MENTORING_TOPICS = 5;
