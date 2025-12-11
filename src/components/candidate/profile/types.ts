export type ProfileSectionId = 
  | 'about'
  | 'career-stage'
  | 'skills-experience'
  | 'launchpad'
  | 'ascent'
  | 'core'
  | 'pivot'
  | 'encore'
  | 'personality'
  | 'bonus-scheme'
  | 'section-visibility';

export type CareerStage = 'launchpad' | 'ascent' | 'core' | 'pivot' | 'encore';

export interface CareerStageInfo {
  id: CareerStage;
  label: string;
  icon: string;
  description: string;
  experienceRange: string;
}

export const CAREER_STAGES: CareerStageInfo[] = [
  {
    id: 'launchpad',
    label: 'The Launchpad',
    icon: 'Rocket',
    description: 'First job seekers, graduates, or those with minimal experience',
    experienceRange: '0-2 years'
  },
  {
    id: 'ascent',
    label: 'The Ascent',
    icon: 'TrendingUp',
    description: 'Building your career, gaining experience and skills',
    experienceRange: '2-5 years'
  },
  {
    id: 'core',
    label: 'The Core',
    icon: 'Zap',
    description: 'Established professionals with solid experience',
    experienceRange: '5+ years'
  },
  {
    id: 'pivot',
    label: 'The Pivot',
    icon: 'RefreshCw',
    description: 'Career changers looking for a new direction',
    experienceRange: 'Any experience'
  },
  {
    id: 'encore',
    label: 'The Encore',
    icon: 'Award',
    description: 'Semi-retired or returning to meaningful part-time work',
    experienceRange: 'Experienced'
  }
];

export interface ProfileSectionGroup {
  id: ProfileSectionId;
  label: string;
  icon: string;
  required: boolean;
  description: string;
}

export const PROFILE_SECTIONS: ProfileSectionGroup[] = [
  {
    id: 'about',
    label: 'About Me',
    icon: 'User',
    required: true,
    description: 'Contact info, CV, gallery, availability & verification'
  },
  {
    id: 'career-stage',
    label: 'Career Stage',
    icon: 'Compass',
    required: true,
    description: 'Select your career journey stage'
  },
  {
    id: 'skills-experience',
    label: 'Skills & Experience',
    icon: 'Award',
    required: true,
    description: 'Skills, experience, education & portfolio'
  },
  {
    id: 'launchpad',
    label: 'The Launchpad',
    icon: 'Rocket',
    required: false,
    description: 'For first-time job seekers (0-2 years)'
  },
  {
    id: 'ascent',
    label: 'The Ascent',
    icon: 'TrendingUp',
    required: false,
    description: 'For those building their career (2-5 years)'
  },
  {
    id: 'core',
    label: 'The Core',
    icon: 'Zap',
    required: false,
    description: 'For established professionals (5+ years)'
  },
  {
    id: 'pivot',
    label: 'The Pivot',
    icon: 'RefreshCw',
    required: false,
    description: 'For career changers'
  },
  {
    id: 'encore',
    label: 'The Encore',
    icon: 'Award',
    required: false,
    description: 'For semi-retired / returning professionals'
  },
  {
    id: 'personality',
    label: 'Personality',
    icon: 'Brain',
    required: false,
    description: 'Your working style & traits'
  },
  {
    id: 'bonus-scheme',
    label: 'Bonus Scheme',
    icon: 'Percent',
    required: false,
    description: '"You\'re Hired" commission settings'
  },
  {
    id: 'section-visibility',
    label: 'Section Visibility',
    icon: 'Eye',
    required: false,
    description: 'Control what employers see'
  }
];
