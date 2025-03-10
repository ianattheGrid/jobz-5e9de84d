
import {
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
} from "../../constants/public-sector";

export const getTitlesForPublicSectorSpecialisation = (specialisation: string): string[] => {
  switch (specialisation) {
    case "Central Government":
      return centralGovernmentRoles;
    case "Local Government":
      return localGovernmentRoles;
    case "Healthcare and Public Health":
      return healthcareRoles;
    case "Education and Training":
      return educationRoles;
    case "Law Enforcement and Security":
      return lawEnforcementRoles;
    case "Social Care and Community Support":
      return socialCareRoles;
    case "Transport and Infrastructure":
      return infrastructureRoles;
    case "Environmental and Sustainability":
      return environmentalRoles;
    case "Regulatory and Compliance":
      return regulatoryRoles;
    case "Public Sector Leadership":
      return leadershipRoles;
    case "Administrative Support":
      return administrativeRoles;
    case "Specialized Public Sector":
      return specializedRoles;
    default:
      return [];
  }
};
