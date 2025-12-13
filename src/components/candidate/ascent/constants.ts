// Reuse sectors from getting-started
export { SECTOR_OPTIONS, HOBBY_OPTIONS } from '../getting-started/constants';

// Work Skills - grouped by category
export const WORK_SKILLS_OPTIONS = {
  people_service: [
    { key: 'customer_service', label: 'Customer service' },
    { key: 'dealing_complaints', label: 'Dealing with complaints' },
    { key: 'building_relationships', label: 'Building relationships' },
    { key: 'teamwork', label: 'Teamwork' },
  ],
  practical_operational: [
    { key: 'handling_cash', label: 'Handling cash or payments' },
    { key: 'stock_management', label: 'Stock or inventory management' },
    { key: 'scheduling', label: 'Scheduling or rota management' },
    { key: 'following_processes', label: 'Following detailed processes' },
  ],
  organising_admin: [
    { key: 'data_entry', label: 'Data entry' },
    { key: 'spreadsheets', label: 'Using spreadsheets' },
    { key: 'managing_bookings', label: 'Managing bookings or calendars' },
    { key: 'preparing_reports', label: 'Preparing reports or documents' },
  ],
  creative_problem_solving: [
    { key: 'writing_content', label: 'Writing or content creation' },
    { key: 'design_visual', label: 'Design or visual work' },
    { key: 'coming_up_ideas', label: 'Coming up with ideas' },
    { key: 'solving_problems', label: 'Solving day-to-day problems' },
  ],
};

// Flatten for easy iteration
export const ALL_WORK_SKILLS = [
  ...WORK_SKILLS_OPTIONS.people_service,
  ...WORK_SKILLS_OPTIONS.practical_operational,
  ...WORK_SKILLS_OPTIONS.organising_admin,
  ...WORK_SKILLS_OPTIONS.creative_problem_solving,
];

export const WORK_STYLE_GROWTH_OPTIONS = [
  { key: 'run_things_alone', label: "I'm trusted to run things on my own when needed" },
  { key: 'trained_others', label: "I've trained or supported newer team members" },
  { key: 'extra_responsibilities', label: "I've taken on extra responsibilities over time" },
  { key: 'customer_facing', label: "I'm comfortable speaking to customers/clients on my own" },
  { key: 'improved_process', label: "I've helped improve a process or way of doing things" },
  { key: 'cross_team', label: "I've worked across different teams or departments" },
];

export const MORE_OF_OPTIONS = [
  { key: 'learning_training', label: 'Learning and structured training' },
  { key: 'clear_progression', label: 'A clear path to progress in my role' },
  { key: 'own_area', label: 'Responsibility for my own area' },
  { key: 'working_with_people', label: 'Working directly with people' },
  { key: 'behind_scenes', label: 'Behind-the-scenes organising/operations' },
  { key: 'creative_work', label: 'Creative or problem-solving work' },
  { key: 'tech_data', label: 'Working with tech, data, or systems' },
  { key: 'flexible_hybrid', label: 'Flexible hours or hybrid working' },
];

export const LESS_OF_OPTIONS = [
  { key: 'last_minute_shifts', label: 'Constantly changing last-minute shifts' },
  { key: 'sales_targets', label: 'High-pressure sales targets' },
  { key: 'night_work', label: 'Very late night or overnight work' },
  { key: 'repetitive_tasks', label: 'Purely repetitive tasks' },
  { key: 'long_commute', label: 'Long travel or commute times' },
];

export const NEXT_STEP_OPTIONS = [
  { key: 'same_more_responsibility', label: 'A similar role with more responsibility' },
  { key: 'different_area_same_sector', label: 'A role in a slightly different area of the same sector' },
  { key: 'new_sector_existing_skills', label: 'A role in a new sector that uses my existing skills' },
  { key: 'training_progression', label: 'A role with clearer training and progression' },
  { key: 'open_to_ideas', label: "I'm not sure yet – open to ideas" },
];

export const COMMUTE_OPTIONS = [
  { value: '15', label: 'Up to 15 minutes' },
  { value: '30', label: 'Up to 30 minutes' },
  { value: '45', label: 'Up to 45 minutes' },
  { value: '60', label: 'Up to 1 hour' },
  { value: '90', label: 'Up to 1.5 hours' },
  { value: '0', label: 'No preference / Remote only' },
];

// Character limits
export const ASCENT_CHAR_LIMITS = {
  direction_note: 150,
  role_simple_summary: 100,
  role_main_responsibilities: 200,
  role_challenge_handled: 200,
  role_proud_of: 200,
  tools_or_systems: 150,
  work_style_growth_other: 80,
  next_role_more_of_other: 80,
  next_role_less_of_other: 80,
  about_me_short: 200,
  outside_work_proud_of: 150,
  hobby_detail: 120,
  skills_demonstrated: 100,
  next_step_other: 80,
  next_step_note: 150,
  ref_snippet: 200,
};

export const MAX_WORK_SKILLS = 8;
