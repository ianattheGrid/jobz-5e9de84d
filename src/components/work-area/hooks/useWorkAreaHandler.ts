import { Control } from "react-hook-form";
import { useState } from "react";
import { 
  getTitlesForITSpecialisation,
  getTitlesForCustomerServiceSpecialisation,
  getTitlesForFinanceSpecialisation,
  getTitlesForHRSpecialisation,
  getTitlesForLegalSpecialisation,
  getTitlesForManufacturingSpecialisation,
  getTitlesForEnergySpecialisation,
  getTitlesForQASpecialisation,
  getTitlesForRDSpecialisation,
  getTitlesForMarketingSpecialisation,
  getTitlesForPharmaSpecialisation,
  getTitlesForPublicSectorSpecialisation
} from "../utils/titles";

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
    qa: false,
    marketing: false
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
      qa: false,
      marketing: false
    };

    setShowOtherInput(false);
    setShowSpecializations(resetState);
    setSelectedSpecialisation("");
    setAvailableTitles([]);
    control._formValues.title = "";

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
      case "Marketing":
        setShowSpecializations({ ...resetState, marketing: true });
        break;
      case "Other":
        setShowOtherInput(true);
        break;
    }
  };

  const handleSpecialisationChange = (specialisation: string) => {
    setSelectedSpecialisation(specialisation);
    control._formValues.title = "";
    
    let titles: string[] = [];
    const showSpec = showSpecializations;

    if (showSpec.it) {
      titles = getTitlesForITSpecialisation(specialisation);
    } else if (showSpec.customerService) {
      titles = getTitlesForCustomerServiceSpecialisation(specialisation);
    } else if (showSpec.finance) {
      titles = getTitlesForFinanceSpecialisation(specialisation);
    } else if (showSpec.hr) {
      titles = getTitlesForHRSpecialisation(specialisation);
    } else if (showSpec.legal) {
      titles = getTitlesForLegalSpecialisation(specialisation);
    } else if (showSpec.manufacturing) {
      titles = getTitlesForManufacturingSpecialisation(specialisation);
    } else if (showSpec.energy) {
      titles = getTitlesForEnergySpecialisation(specialisation);
    } else if (showSpec.pharma) {
      titles = getTitlesForPharmaSpecialisation(specialisation);
    } else if (showSpec.publicSector) {
      titles = getTitlesForPublicSectorSpecialisation(specialisation);
    } else if (showSpec.rd) {
      titles = getTitlesForRDSpecialisation(specialisation);
    } else if (showSpec.qa) {
      titles = getTitlesForQASpecialisation(specialisation);
    } else if (showSpec.marketing) {
      titles = getTitlesForMarketingSpecialisation(specialisation);
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
