
import { allQARoles } from '../../constants/qa-roles';

export const getTitlesForQASpecialisation = (specialisation: string): string[] => {
  switch (specialisation) {
    case "Software Testing":
      return allQARoles.softwareTestingRoles;
    case "Manufacturing QA":
      return allQARoles.manufacturingQARoles;
    case "Food & Beverage QA":
      return allQARoles.foodQARoles;
    case "Healthcare QA":
      return allQARoles.healthcareQARoles;
    case "Regulatory Compliance":
      return allQARoles.regulatoryRoles;
    case "Product Quality":
      return allQARoles.productQARoles;
    case "Process Quality":
      return allQARoles.processQARoles;
    case "Quality Systems":
      return allQARoles.qualitySystemsRoles;
    case "Quality Engineering":
      return allQARoles.qualityEngineeringRoles;
    case "Specialized QA":
      return allQARoles.specializedQARoles;
    default:
      return [];
  }
};
