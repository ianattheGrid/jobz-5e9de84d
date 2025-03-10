import { UseSpecializationStateReturn } from "../hooks/useSpecializationState";

export const handleWorkAreaChange = (
  value: string,
  { setters, resetAllSpecializations }: UseSpecializationStateReturn
) => {
  resetAllSpecializations();

  switch (value) {
    case "IT":
      setters.setShowITSpecialization(true);
      break;
    case "Customer Service":
      setters.setShowCustomerServiceSpecialization(true);
      break;
    case "Accounting & Finance":
      setters.setShowFinanceSpecialization(true);
      break;
    case "Public Sector":
      setters.setShowPublicSectorSpecialization(true);
      break;
    case "Engineering":
      setters.setShowEngineeringSpecialization(true);
      break;
    case "Hospitality & Tourism":
      setters.setShowHospitalitySpecialization(true);
      break;
    case "Human Resources":
      setters.setShowHRSpecialization(true);
      break;
    case "Legal":
      setters.setShowLegalSpecialization(true);
      break;
    case "Manufacturing":
      setters.setShowManufacturingSpecialization(true);
      break;
    case "Energy & Utilities":
      setters.setShowEnergySpecialization(true);
      break;
    case "Pharma":
      setters.setShowPharmaSpecialization(true);
      break;
    case "R&D":
      setters.setShowRDSpecialization(true);
      break;
    case "Sales":
      setters.setShowSalesSpecialization(true);
      break;
    case "Other":
      setters.setShowOtherInput(true);
      break;
  }
};
