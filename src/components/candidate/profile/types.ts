export type ProfileSectionId = 
  | 'about'
  | 'work-preferences'
  | 'skills-experience'
  | 'getting-started'
  | 'second-chapter'
  | 'personality'
  | 'bonus-scheme'
  | 'section-visibility';

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
    description: 'Contact info, CV, gallery & verification'
  },
  {
    id: 'work-preferences',
    label: 'Work Preferences',
    icon: 'Briefcase',
    required: true,
    description: 'Job type, salary, availability'
  },
  {
    id: 'skills-experience',
    label: 'Skills & Experience',
    icon: 'Award',
    required: true,
    description: 'Skills, experience, education & portfolio'
  },
  {
    id: 'getting-started',
    label: 'Getting Started',
    icon: 'Rocket',
    required: false,
    description: 'For first-time job seekers'
  },
  {
    id: 'second-chapter',
    label: 'Second Chapter',
    icon: 'RefreshCw',
    required: false,
    description: 'For career changers'
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
