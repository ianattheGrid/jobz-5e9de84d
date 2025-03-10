
import { Control } from "react-hook-form";
import { UseSpecializationStateReturn } from "../hooks/useSpecializationState";
import { 
  getTitlesForITSpecialisation,
  getTitlesForCustomerServiceSpecialisation,
  getTitlesForFinanceSpecialisation,
  getTitlesForPublicSectorSpecialisation,
  getTitlesForEngineeringSpecialisation,
  getTitlesForHospitalitySpecialisation,
  getTitlesForRDSpecialisation,
  getTitlesForSalesSpecialisation
} from "./getTitlesForSpecialisation";

export const handleSpecializationChange = (
  specialisation: string,
  control: Control<any>,
  { states, setters }: UseSpecializationStateReturn
) => {
  setters.setSelectedSpecialisation(specialisation);
  control._formValues.title = "";
  
  let titles: string[] = [];
  if (states.showITSpecialization) {
    titles = getTitlesForITSpecialisation(specialisation);
  } else if (states.showCustomerServiceSpecialization) {
    titles = getTitlesForCustomerServiceSpecialisation(specialisation);
  } else if (states.showFinanceSpecialization) {
    titles = getTitlesForFinanceSpecialisation(specialisation);
  } else if (states.showPublicSectorSpecialization) {
    titles = getTitlesForPublicSectorSpecialisation(specialisation);
  } else if (states.showEngineeringSpecialization) {
    titles = getTitlesForEngineeringSpecialisation(specialisation);
  } else if (states.showHospitalitySpecialization) {
    titles = getTitlesForHospitalitySpecialisation(specialisation);
  } else if (states.showRDSpecialization) {
    titles = getTitlesForRDSpecialisation(specialisation);
  } else if (states.showSalesSpecialization) {
    titles = getTitlesForSalesSpecialisation(specialisation);
  }
  
  setters.setAvailableTitles(titles);
};

