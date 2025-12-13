// Reuse sectors from getting-started
export { SECTOR_OPTIONS } from '../getting-started/constants';

// Years Experience Range Options
export const YEARS_EXPERIENCE_OPTIONS = [
  { value: '5-7', label: '5-7 years' },
  { value: '7-10', label: '7-10 years' },
  { value: '10-15', label: '10-15 years' },
  { value: '15-20', label: '15-20 years' },
  { value: '20+', label: '20+ years' },
];

// Core Strength Tags (Section 1)
export const CORE_STRENGTH_OPTIONS = [
  { key: 'people_leadership', label: 'People Leadership' },
  { key: 'customer_growth', label: 'Customer Growth & Accounts' },
  { key: 'operations_delivery', label: 'Operations & Service Delivery' },
  { key: 'projects_change', label: 'Projects & Change' },
  { key: 'technical_specialist', label: 'Technical / Specialist' },
  { key: 'strategy_planning', label: 'Strategy & Planning' },
  { key: 'training_coaching', label: 'Training & Coaching' },
];

// Work Focus Tags - Grouped (Section 3)
export const CORE_WORK_FOCUS_OPTIONS = {
  people_leadership: {
    label: 'People & Leadership',
    options: [
      { key: 'managing_teams', label: 'Managing teams' },
      { key: 'coaching_mentoring', label: 'Coaching & mentoring' },
      { key: 'handling_conflict', label: 'Handling conflict' },
      { key: 'hiring_onboarding', label: 'Hiring & onboarding' },
    ],
  },
  customers_growth: {
    label: 'Customers & Growth',
    options: [
      { key: 'account_management', label: 'Account management' },
      { key: 'business_development', label: 'Business development' },
      { key: 'customer_retention', label: 'Customer retention' },
      { key: 'upselling', label: 'Upselling / cross-selling' },
    ],
  },
  operations_delivery: {
    label: 'Operations & Delivery',
    options: [
      { key: 'process_design', label: 'Process design' },
      { key: 'service_delivery', label: 'Service delivery' },
      { key: 'logistics_scheduling', label: 'Logistics / scheduling' },
      { key: 'quality_compliance', label: 'Quality & compliance' },
    ],
  },
  projects_change: {
    label: 'Projects & Change',
    options: [
      { key: 'project_management', label: 'Project management' },
      { key: 'change_management', label: 'Change management' },
      { key: 'rollouts_implementations', label: 'Rollouts & implementations' },
      { key: 'cross_team_coordination', label: 'Cross-team coordination' },
    ],
  },
  strategy_improvement: {
    label: 'Strategy & Improvement',
    options: [
      { key: 'planning_forecasting', label: 'Planning & forecasting' },
      { key: 'performance_analysis', label: 'Performance analysis' },
      { key: 'continuous_improvement', label: 'Continuous improvement' },
    ],
  },
};

// Flatten for easy iteration
export const ALL_CORE_WORK_FOCUS = Object.values(CORE_WORK_FOCUS_OPTIONS).flatMap(g => g.options);

// Leadership Contribution Tags (Section 5)
export const LEADERSHIP_CONTRIBUTION_OPTIONS = [
  { key: 'manage_small_team', label: 'I manage people day-to-day (1–5)' },
  { key: 'manage_medium_team', label: 'I manage a larger team (6–20)' },
  { key: 'manage_large_team', label: 'I lead large or multiple teams (20+)' },
  { key: 'coach_mentor', label: 'I coach or mentor others' },
  { key: 'lead_projects', label: 'I lead projects or workstreams' },
  { key: 'go_to_person', label: "I'm the 'go-to' person when things go wrong" },
  { key: 'train_others', label: 'I train others or run sessions' },
  { key: 'influence_without_authority', label: 'I influence across teams without direct authority' },
  { key: 'specialist_no_manage', label: "I'm a specialist and prefer not to manage people" },
];

// Direction Tags (Section 6)
export const NEXT_ROLE_DIRECTION_OPTIONS = [
  { key: 'step_up_similar', label: 'Step up in a similar role' },
  { key: 'sideways_related', label: 'Move sideways into a related area' },
  { key: 'new_sector_skills', label: 'Shift into a new sector using my existing skills' },
  { key: 'more_leadership', label: 'Take on more leadership/management' },
  { key: 'more_specialist', label: 'Take on a more specialist/expert role' },
  { key: 'fewer_people_management', label: 'Take on fewer people-management responsibilities' },
  { key: 'more_project_change', label: 'More project/change-focused work' },
  { key: 'more_customer_facing', label: 'More customer-facing work' },
  { key: 'more_operations', label: 'More behind-the-scenes / operations work' },
];

// More Of Tags (Section 6)
export const CORE_MORE_OF_OPTIONS = [
  { key: 'strategy', label: 'Strategy & planning' },
  { key: 'hands_on_delivery', label: 'Hands-on delivery' },
  { key: 'team_leadership', label: 'Team leadership' },
  { key: 'client_relationships', label: 'Client relationships' },
  { key: 'analysis', label: 'Analysis & data' },
  { key: 'creativity', label: 'Creativity & innovation' },
  { key: 'structure_predictability', label: 'Structure & predictability' },
  { key: 'flexibility', label: 'Flexibility & autonomy' },
];

// Less Of Tags (Section 6)
export const CORE_LESS_OF_OPTIONS = [
  { key: 'constant_travel', label: 'Constant travel' },
  { key: 'firefighting', label: 'Firefighting / reactive work' },
  { key: 'late_nights_weekends', label: 'Late nights / weekends' },
  { key: 'pure_admin', label: 'Pure admin' },
  { key: 'pure_sales_targets', label: 'Pure sales targets' },
  { key: 'micromanagement', label: 'Being micromanaged' },
];

// Work Environment Tags (Section 7)
export const WORK_ENVIRONMENT_OPTIONS = [
  { key: 'fast_paced', label: 'Fast-paced & dynamic' },
  { key: 'steady_predictable', label: 'Steady & predictable' },
  { key: 'highly_collaborative', label: 'Highly collaborative' },
  { key: 'independent_focused', label: 'Independent / focused work' },
  { key: 'clear_structure', label: 'Clear structure and processes' },
  { key: 'variety_change', label: 'Lots of variety and change' },
];

// Work Structure Tags (Section 7)
export const WORK_STRUCTURE_OPTIONS = [
  { key: 'full_time', label: 'Full-time' },
  { key: 'part_time', label: 'Part-time' },
  { key: 'hybrid', label: 'Hybrid' },
  { key: 'remote_friendly', label: 'Remote-friendly' },
  { key: 'on_site', label: 'On-site mainly' },
  { key: 'project_contract', label: 'Project/contract work' },
];

// Character Limits
export const CORE_CHAR_LIMITS = {
  role_summary: 220,
  role_team_size: 60,
  role_budget_responsibility: 80,
  role_scope: 120,
  role_key_impact: 140,
  one_thing_i_do_really_well: 150,
  proud_moment: 200,
  leadership_note: 150,
  next_role_note: 200,
  outside_work_summary: 200,
  volunteering_item: 120,
  ref_snippet: 250,
};

export const MAX_CORE_STRENGTHS = 5;
export const MIN_CORE_STRENGTHS = 3;
export const MAX_CORE_WORK_FOCUS = 6;
export const MIN_CORE_WORK_FOCUS = 3;
export const MAX_PROUD_MOMENTS = 4;
export const MIN_PROUD_MOMENTS = 2;
export const MAX_KEY_IMPACTS = 4;
export const MIN_KEY_IMPACTS = 2;
export const MAX_VOLUNTEERING_ITEMS = 4;
