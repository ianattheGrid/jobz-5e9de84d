
import { Control } from "react-hook-form";
import { UseSpecializationStateReturn } from "../hooks/useSpecializationState";
import { 
  getTitlesForITSpecialization,
  getTitlesForCustomerServiceSpecialization,
  getTitlesForFinanceSpecialization,
  getTitlesForPublicSectorSpecialization,
  getTitlesForEngineeringSpecialization,
  getTitlesForHospitalitySpecialization,
  getTitlesForRDSpecialization,
  getTitlesForSalesSpecialization
} from "./getTitlesForSpecialization";

export const handleSpecializationChange = (
  specialization: string,
  control: Control<any>,
  { states, setters }: UseSpecializationStateReturn
) => {
  setters.setSelectedSpecialization(specialization);
  control._formValues.title = "";
  
  let titles: string[] = [];
  if (states.showITSpecialization) {
    titles = getTitlesForITSpecialization(specialization);
  } else if (states.showCustomerServiceSpecialization) {
    titles = getTitlesForCustomerServiceSpecialization(specialization);
  } else if (states.showFinanceSpecialization) {
    titles = getTitlesForFinanceSpecialization(specialization);
  } else if (states.showPublicSectorSpecialization) {
    titles = getTitlesForPublicSectorSpecialization(specialization);
  } else if (states.showEngineeringSpecialization) {
    titles = getTitlesForEngineeringSpecialization(specialization);
  } else if (states.showHospitalitySpecialization) {
    titles = getTitlesForHospitalitySpecialization(specialization);
  } else if (states.showRDSpecialization) {
    titles = getTitlesForRDSpecialization(specialization);
  } else if (states.showSalesSpecialization) {
    titles = getTitlesForSalesSpecialization(specialization);
  }
  setters.setAvailableTitles(titles);
};
