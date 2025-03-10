import { Control } from "react-hook-form";
import { useState } from "react";
import { 
  getTitlesForITSpecialisation,
  getTitlesForCustomerServiceSpecialisation,
  getTitlesForFinanceSpecialisation,
  getTitlesForPublicSectorSpecialisation,
  getTitlesForEngineeringSpecialisation,
  getTitlesForHospitalitySpecialisation,
  getTitlesForRDSpecialisation,
  getTitlesForSalesSpecialisation,
  getTitlesForQASpecialisation
} from "../utils/getTitlesForSpecialisation";

export const useWorkAreaHandler = (control: Control<any>) => {
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [showSpecializations, setShowSpecializations] = useState({
    it: false,
    customerService: false,
    finance: false,
    publicSector: false,
    engineering: false,
    hospitality: false,
    hr: false,
    legal: false,
    manufacturing: false,
    energy: false,
    pharma: false,
    rd: false,
    sales: false,
    qa: false
  });
  const [selectedSpecialisation, setSelectedSpecialisation] = useState<string>("");
  const [availableTitles, setAvailableTitles] = useState<string[]>([]);

  const handleWorkAreaChange = (value: string) => {
    const resetState = {
      it: false,
      customerService: false,
      finance: false,
      publicSector: false,
      engineering: false,
      hospitality: false,
      hr: false,
      legal: false,
      manufacturing: false,
      energy: false,
      pharma: false,
      rd: false,
      sales: false,
      qa: false
    };

    setShowOtherInput(false);
    setShowSpecializations(resetState);

    switch (value) {
      case "IT":
        setShowSpecializations({ ...resetState, it: true });
        break;
      case "Customer Service":
        setShowSpecializations({ ...resetState, customerService: true });
        break;
      case "Accounting & Finance":
        setShowSpecializations({ ...resetState, finance: true });
        break;
      case "Public Sector":
        setShowSpecializations({ ...resetState, publicSector: true });
        break;
      case "Engineering":
        setShowSpecializations({ ...resetState, engineering: true });
        break;
      case "Hospitality & Tourism":
        setShowSpecializations({ ...resetState, hospitality: true });
        break;
      case "Human Resources":
        setShowSpecializations({ ...resetState, hr: true });
        break;
      case "Legal":
        setShowSpecializations({ ...resetState, legal: true });
        break;
      case "Manufacturing":
        setShowSpecializations({ ...resetState, manufacturing: true });
        break;
      case "Energy & Utilities":
        setShowSpecializations({ ...resetState, energy: true });
        break;
      case "Pharma":
        setShowSpecializations({ ...resetState, pharma: true });
        break;
      case "R&D":
        setShowSpecializations({ ...resetState, rd: true });
        break;
      case "Sales":
        setShowSpecializations({ ...resetState, sales: true });
        break;
      case "Quality Assurance":
        setShowSpecializations({ ...resetState, qa: true });
        break;
      case "Other":
        setShowOtherInput(true);
        break;
    }

    setSelectedSpecialisation("");
    setAvailableTitles([]);
    control._formValues.title = "";
  };

  const handleSpecialisationChange = (specialisation: string) => {
    setSelectedSpecialisation(specialisation);
    control._formValues.title = "";
    
    let titles: string[] = [];
    const { it, customerService, finance, publicSector, engineering, hospitality, rd, sales, qa } = showSpecializations;
    
    if (qa) {
      titles = getTitlesForQASpecialisation(specialisation);
    } else if (it) {
      titles = getTitlesForITSpecialisation(specialisation);
    } else if (customerService) {
      titles = getTitlesForCustomerServiceSpecialisation(specialisation);
    } else if (finance) {
      titles = getTitlesForFinanceSpecialisation(specialisation);
    } else if (publicSector) {
      titles = getTitlesForPublicSectorSpecialisation(specialisation);
    } else if (engineering) {
      titles = getTitlesForEngineeringSpecialisation(specialisation);
    } else if (hospitality) {
      titles = getTitlesForHospitalitySpecialisation(specialisation);
    } else if (rd) {
      titles = getTitlesForRDSpecialisation(specialisation);
    } else if (sales) {
      titles = getTitlesForSalesSpecialisation(specialisation);
    }
    
    setAvailableTitles(titles);
  };

  return {
    showOtherInput,
    showSpecializations,
    selectedSpecialisation,
    availableTitles,
    handleWorkAreaChange,
    handleSpecialisationChange
  };
};
