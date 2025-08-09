
import { Control, useWatch } from "react-hook-form";
import { useState, useEffect } from "react";
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
import { getTitlesForSalesSpecialisation } from "../utils/titles/sales-titles";
import { itRoles } from "../constants/it-roles";

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
  
  // Watch for form values
  const workArea = useWatch({ control, name: 'workArea' });
  const itSpecialization = useWatch({ control, name: 'itSpecialization' });
  const jobTitle = useWatch({ control, name: 'job_title' });
  const yearsInCurrentTitle = useWatch({ control, name: 'years_in_current_title' });
  
  console.log("Current form values:", { workArea, itSpecialization, jobTitle, yearsInCurrentTitle });
  console.log("Current available titles:", availableTitles);

  // Initialize based on existing values
  useEffect(() => {
    if (workArea) {
      console.log("Initializing with workArea:", workArea);
      handleWorkAreaChange(workArea);
      
      // If we also have a specialization, set it up
      if (itSpecialization) {
        console.log("Initializing with specialization:", itSpecialization);
        handleSpecialisationChange(itSpecialization);
      }
    }
  }, []);

  // Effect to populate titles when specialization is selected
  useEffect(() => {
    if (itSpecialization && workArea === "IT") {
      const titles = getTitlesForITSpecialisation(itSpecialization);
      console.log(`Setting available titles for IT:${itSpecialization}:`, titles);
      setAvailableTitles(titles);
      setSelectedSpecialisation(itSpecialization);
    }
  }, [itSpecialization, workArea]);

  // Effect to ensure job title is in available titles for IT roles
  useEffect(() => {
    if (workArea === "IT" && itSpecialization && jobTitle) {
      // Get titles for this specialization
      const titles = getTitlesForITSpecialisation(itSpecialization);
      
      // If the job title isn't in the list but we have a valid one, add it
      if (jobTitle && !titles.includes(jobTitle)) {
        // Find if the job title exists in any IT specialization
        let titleFound = false;
        
        // Check all IT role categories
        Object.values(itRoles).forEach(titleArray => {
          if (titleArray.includes(jobTitle)) {
            titleFound = true;
          }
        });
        
        // If it's a valid IT title, add it to available titles
        if (titleFound) {
          setAvailableTitles([...titles, jobTitle]);
        }
      }
    }
  }, [workArea, itSpecialization, jobTitle]);

  const handleWorkAreaChange = (value: string) => {
    console.log("handleWorkAreaChange called with:", value);
    
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
    
    // Don't reset these if we already have values and the work area hasn't changed
    if (value !== workArea) {
      setSelectedSpecialisation("");
      setAvailableTitles([]);
    }

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
    console.log("handleSpecialisationChange called with:", specialisation);
    setSelectedSpecialisation(specialisation);
    
    let titles: string[] = [];

    // Determine titles based on the currently selected work area (more reliable than flags)
    switch (workArea) {
      case "IT":
        titles = getTitlesForITSpecialisation(specialisation);
        break;
      case "Customer Service":
        titles = getTitlesForCustomerServiceSpecialisation(specialisation);
        break;
      case "Accounting & Finance":
        titles = getTitlesForFinanceSpecialisation(specialisation);
        break;
      case "Human Resources":
        titles = getTitlesForHRSpecialisation(specialisation);
        break;
      case "Legal":
        titles = getTitlesForLegalSpecialisation(specialisation);
        break;
      case "Manufacturing":
        titles = getTitlesForManufacturingSpecialisation(specialisation);
        break;
      case "Energy & Utilities":
        titles = getTitlesForEnergySpecialisation(specialisation);
        break;
      case "Pharma":
        titles = getTitlesForPharmaSpecialisation(specialisation);
        break;
      case "Public Sector":
        titles = getTitlesForPublicSectorSpecialisation(specialisation);
        break;
      case "R&D":
        titles = getTitlesForRDSpecialisation(specialisation);
        break;
      case "Quality Assurance":
        titles = getTitlesForQASpecialisation(specialisation);
        break;
      case "Sales":
        titles = getTitlesForSalesSpecialisation(specialisation);
        break;
      case "Marketing":
        titles = getTitlesForMarketingSpecialisation(specialisation);
        break;
      default:
        titles = [];
    }
    
    console.log("Setting available titles:", titles);
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
