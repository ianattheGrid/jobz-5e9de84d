
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
  if (states.showITSpecialisation) {
    titles = getTitlesForITSpecialisation(specialisation);
  } else if (states.showCustomerServiceSpecialisation) {
    titles = getTitlesForCustomerServiceSpecialisation(specialisation);
  } else if (states.showFinanceSpecialisation) {
    titles = getTitlesForFinanceSpecialisation(specialisation);
  } else if (states.showPublicSectorSpecialisation) {
    titles = getTitlesForPublicSectorSpecialisation(specialisation);
  } else if (states.showEngineeringSpecialisation) {
    titles = getTitlesForEngineeringSpecialisation(specialisation);
  } else if (states.showHospitalitySpecialisation) {
    titles = getTitlesForHospitalitySpecialisation(specialisation);
  } else if (states.showRDSpecialisation) {
    titles = getTitlesForRDSpecialisation(specialisation);
  } else if (states.showSalesSpecialisation) {
    titles = getTitlesForSalesSpecialisation(specialisation);
  }
  
  setters.setAvailableTitles(titles);
};
