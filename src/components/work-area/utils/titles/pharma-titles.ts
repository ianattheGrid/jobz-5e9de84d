
import {
  pharmaRnDRoles,
  clinicalTrialsRoles,
  pharmaManufacturingRoles,
  qualityAssuranceRoles,
  regulatoryAffairsRoles,
  pharmaSalesRoles,
  medicalWritingRoles,
  pharmaSupplyChainRoles,
  pharmacovigilanceRoles,
  specializedPharmaRoles
} from "../../constants/pharma-roles";

export const getTitlesForPharmaSpecialisation = (specialisation: string): string[] => {
  switch (specialisation) {
    case "Research and Development (R&D)":
      return pharmaRnDRoles;
    case "Clinical Trials and Medical Affairs":
      return clinicalTrialsRoles;
    case "Manufacturing and Production":
      return pharmaManufacturingRoles;
    case "Quality Assurance and Quality Control (QA/QC)":
      return qualityAssuranceRoles;
    case "Regulatory Affairs":
      return regulatoryAffairsRoles;
    case "Sales and Marketing":
      return pharmaSalesRoles;
    case "Medical Writing and Communication":
      return medicalWritingRoles;
    case "Supply Chain and Logistics":
      return pharmaSupplyChainRoles;
    case "Pharmacovigilance and Drug Safety":
      return pharmacovigilanceRoles;
    case "Specialized Pharma Roles":
      return specializedPharmaRoles;
    default:
      return [];
  }
};
