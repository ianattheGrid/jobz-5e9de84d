export const centralGovernmentRoles = [
  "Civil Servant",
  "Policy Advisor",
  "Policy Officer",
  "Government Economist",
  "Intelligence Analyst",
  "Parliamentary Assistant",
  "Project Delivery Manager",
  "Senior Civil Service (SCS) Roles",
  "Statistician (Government)"
];

export const localGovernmentRoles = [
  "Community Development Officer",
  "Council Administrator",
  "Environmental Health Officer",
  "Housing Officer",
  "Local Government Officer",
  "Planning Officer",
  "Revenues and Benefits Officer",
  "Town Planner"
];

export const healthcareRoles = [
  "Doctor (NHS)",
  "Nurse (NHS)",
  "Paramedic",
  "Public Health Advisor",
  "Public Health Consultant",
  "Social Prescribing Link Worker",
  "Surgeon",
  "Therapist (e.g., Physiotherapist, Occupational Therapist)"
];

export const educationRoles = [
  "Careers Advisor",
  "Education Welfare Officer",
  "Headteacher",
  "Lecturer (Public Universities)",
  "Primary School Teacher",
  "Secondary School Teacher",
  "Teaching Assistant",
  "Training and Development Officer"
];

export const lawEnforcementRoles = [
  "Armed Forces Personnel",
  "Border Force Officer",
  "Firefighter",
  "Intelligence Officer",
  "Police Community Support Officer (PCSO)",
  "Police Officer",
  "Probation Officer",
  "Security Analyst"
];

export const socialCareRoles = [
  "Care Worker",
  "Child Protection Officer",
  "Family Support Worker",
  "Probation Officer",
  "Social Worker",
  "Youth Worker"
];

export const infrastructureRoles = [
  "Civil Engineer (Public Sector)",
  "Highways Engineer",
  "Public Transport Planner",
  "Transport Manager",
  "Urban Planner"
];

export const environmentalRoles = [
  "Conservation Officer",
  "Environmental Consultant",
  "Environmental Manager",
  "Sustainability Officer",
  "Waste Management Officer"
];

export const regulatoryRoles = [
  "Compliance Officer",
  "Health and Safety Officer",
  "Inspector (e.g., Ofsted Inspector, Food Standards Inspector)",
  "Regulatory Affairs Specialist"
];

export const leadershipRoles = [
  "Chief Executive (Local Authority)",
  "Director of Public Health",
  "Head of Service (e.g., Housing, Education, Social Care)",
  "Operations Manager (Public Sector)",
  "Programme Manager"
];

export const administrativeRoles = [
  "Administrative Assistant",
  "Business Support Officer",
  "Data Entry Clerk",
  "HR Officer (Public Sector)",
  "Personal Assistant (PA)",
  "Receptionist"
];

export const specializedRoles = [
  "Archivist",
  "Librarian (Public Libraries)",
  "Museum Curator",
  "Public Relations Officer",
  "Researcher (Public Sector)"
];

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