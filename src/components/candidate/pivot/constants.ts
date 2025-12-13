// Reuse from other modules
export { SECTOR_OPTIONS } from '../getting-started/constants';
export { 
  WORK_ENVIRONMENT_OPTIONS, 
  WORK_STRUCTURE_OPTIONS,
  CORE_MORE_OF_OPTIONS,
  CORE_LESS_OF_OPTIONS,
} from '../core/constants';

// Pivot Type Options
export const PIVOT_TYPE_OPTIONS = [
  { key: 'internal', label: 'Internal Pivot', description: 'New role type in same sector' },
  { key: 'external', label: 'External Pivot', description: 'New sector and/or role entirely' },
];

// Transferable Skills (curated high-level list)
export const TRANSFERABLE_SKILLS_OPTIONS = [
  { key: 'problem_solving', label: 'Problem Solving' },
  { key: 'communication', label: 'Communication' },
  { key: 'project_management', label: 'Project Management' },
  { key: 'data_analysis', label: 'Data Analysis' },
  { key: 'client_relations', label: 'Client Relations' },
  { key: 'team_leadership', label: 'Team Leadership' },
  { key: 'process_improvement', label: 'Process Improvement' },
  { key: 'adaptability', label: 'Adaptability' },
  { key: 'research', label: 'Research' },
  { key: 'strategic_thinking', label: 'Strategic Thinking' },
  { key: 'negotiation', label: 'Negotiation' },
  { key: 'training_mentoring', label: 'Training & Mentoring' },
  { key: 'creative_thinking', label: 'Creative Thinking' },
  { key: 'budget_management', label: 'Budget Management' },
];

// Preparation Activities
export const PIVOT_PREPARATION_OPTIONS = [
  { key: 'courses_certifications', label: 'Completed relevant courses/certifications' },
  { key: 'personal_projects', label: 'Worked on personal projects/portfolio' },
  { key: 'volunteered_interned', label: 'Volunteered or interned in the new field' },
  { key: 'workshops_webinars', label: 'Attended workshops/webinars' },
  { key: 'networking', label: 'Networked with professionals in the new field' },
  { key: 'self_studied', label: 'Read extensively / self-studied' },
  { key: 'other', label: 'Other (please specify)' },
];

// Character Limits
export const PIVOT_CHAR_LIMITS = {
  pivot_motivation: 350,
  transferable_skill_example: 200,
  pivot_preparation_details: 300,
  role_brief_context: 150,
  role_achievement: 140,
  new_role_note: 200,
  ref_snippet: 250,
};

// Selection limits
export const MAX_TARGET_SECTORS = 3;
export const MAX_TARGET_ROLE_TYPES = 3;
export const MAX_TRANSFERABLE_SKILLS = 6;
export const MIN_TRANSFERABLE_SKILLS = 3;
export const MAX_SKILL_EXAMPLES = 4;
export const MIN_SKILL_EXAMPLES = 2;
export const MAX_JOURNEY_ROLES = 3;
export const MAX_ACHIEVEMENTS_PER_ROLE = 2;
