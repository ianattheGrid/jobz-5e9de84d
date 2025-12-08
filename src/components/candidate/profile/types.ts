export type ProfileSectionId = 
  | 'about'
  | 'work-preferences'
  | 'skills-experience'
  | 'media'
  | 'special'
  | 'settings';

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
    description: 'Contact info & profile picture'
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
    description: 'Skills, experience, education'
  },
  {
    id: 'media',
    label: 'Media & Portfolio',
    icon: 'Image',
    required: false,
    description: 'Gallery, portfolio, CV'
  },
  {
    id: 'special',
    label: 'Special Sections',
    icon: 'Sparkles',
    required: false,
    description: 'Proof of Potential, Personality'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'Settings',
    required: false,
    description: 'Visibility, verification, preferences'
  }
];
