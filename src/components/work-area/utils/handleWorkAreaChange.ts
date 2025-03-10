
import { UseSpecializationStateReturn } from "../hooks/useSpecializationState";

export const handleWorkAreaChange = (
  value: string,
  { setters, resetAllSpecializations }: UseSpecializationStateReturn
) => {
  resetAllSpecializations();

  switch (value) {
    case "IT":
      setters.setShowITSpecialisation(true);
      break;
    case "Customer Service":
      setters.setShowCustomerServiceSpecialisation(true);
      break;
    case "Accounting & Finance":
      setters.setShowFinanceSpecialisation(true);
      break;
    case "Public Sector":
      setters.setShowPublicSectorSpecialisation(true);
      break;
    case "Engineering":
      setters.setShowEngineeringSpecialisation(true);
      break;
    case "Hospitality & Tourism":
      setters.setShowHospitalitySpecialisation(true);
      break;
    case "Human Resources":
      setters.setShowHRSpecialisation(true);
      break;
    case "Legal":
      setters.setShowLegalSpecialisation(true);
      break;
    case "Manufacturing":
      setters.setShowManufacturingSpecialisation(true);
      break;
    case "Energy & Utilities":
      setters.setShowEnergySpecialisation(true);
      break;
    case "Pharma":
      setters.setShowPharmaSpecialisation(true);
      break;
    case "R&D":
      setters.setShowRDSpecialisation(true);
      break;
    case "Sales":
      setters.setShowSalesSpecialisation(true);
      break;
    case "Other":
      setters.setShowOtherInput(true);
      break;
  }
};
