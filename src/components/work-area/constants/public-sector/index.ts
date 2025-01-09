export * from './central-government-roles';
export * from './local-government-roles';
export * from './healthcare-roles';
export * from './education-roles';
export * from './law-enforcement-roles';
export * from './social-care-roles';
export * from './infrastructure-roles';
export * from './environmental-roles';
export * from './regulatory-roles';
export * from './leadership-roles';
export * from './administrative-roles';
export * from './specialized-roles';

export const publicSectorSpecializations = [
  "Central Government",
  "Local Government",
  "Healthcare and Public Health",
  "Education and Training",
  "Law Enforcement and Security",
  "Social Care and Community Support",
  "Transport and Infrastructure",
  "Environmental and Sustainability",
  "Regulatory and Compliance",
  "Public Sector Leadership",
  "Administrative Support",
  "Specialized Public Sector"
] as const;

export type PublicSectorSpecialization = typeof publicSectorSpecializations[number];

export const publicSectorRoles = {
  centralGovernmentRoles,
  localGovernmentRoles,
  healthcareRoles,
  educationRoles,
  lawEnforcementRoles,
  socialCareRoles,
  infrastructureRoles,
  environmentalRoles,
  regulatoryRoles,
  leadershipRoles,
  administrativeRoles,
  specializedRoles
};