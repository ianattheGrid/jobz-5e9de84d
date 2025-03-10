import { useState } from "react";
import { Control } from "react-hook-form";
import WorkAreaSelect from "./work-area/selectors/WorkAreaSelect";
import { 
  getTitlesForITSpecialisation,
  getTitlesForCustomerServiceSpecialisation,
  getTitlesForFinanceSpecialisation,
  getTitlesForPublicSectorSpecialisation,
  getTitlesForEngineeringSpecialisation,
  getTitlesForHospitalitySpecialisation,
  getTitlesForRDSpecialisation,
  getTitlesForSalesSpecialisation
} from "./work-area/utils/getTitlesForSpecialisation";

import ITSpecialisationSelect from "./work-area/specializations/ITSpecializationSelect";
import CustomerServiceSpecializationSelect from "./work-area/specializations/CustomerServiceSpecializationSelect";
import FinanceSpecializationSelect from "./work-area/specializations/FinanceSpecializationSelect";
import PublicSectorSpecializationSelect from "./work-area/specializations/PublicSectorSpecializationSelect";
import EngineeringSpecializationSelect from "./work-area/specializations/EngineeringSpecializationSelect";
import HospitalitySpecializationSelect from "./work-area/specializations/HospitalitySpecializationSelect";
import HRSpecializationSelect from "./work-area/specializations/HRSpecializationSelect";
import LegalSpecializationSelect from "./work-area/specializations/LegalSpecializationSelect";
import ManufacturingSpecializationSelect from "./work-area/specializations/ManufacturingSpecializationSelect";
import EnergySpecializationSelect from "./work-area/specializations/EnergySpecializationSelect";
import PharmaSpecializationSelect from "./work-area/specializations/PharmaSpecializationSelect";
import RDSpecializationSelect from "./work-area/specializations/RDSpecializationSelect";
import JobTitleSelect from "./work-area/JobTitleSelect";
import OtherFields from "./work-area/fields/OtherFields";
import SalesSpecializationSelect from "./work-area/specializations/SalesSpecializationSelect";

interface WorkAreaFieldProps {
  control: Control<any>;
}

const WorkAreaField = ({ control }: WorkAreaFieldProps) => {
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [showITSpecialisation, setShowITSpecialisation] = useState(false);
  const [showCustomerServiceSpecialisation, setShowCustomerServiceSpecialisation] = useState(false);
  const [showFinanceSpecialisation, setShowFinanceSpecialisation] = useState(false);
  const [showPublicSectorSpecialisation, setShowPublicSectorSpecialisation] = useState(false);
  const [showEngineeringSpecialisation, setShowEngineeringSpecialisation] = useState(false);
  const [showHospitalitySpecialisation, setShowHospitalitySpecialisation] = useState(false);
  const [showHRSpecialisation, setShowHRSpecialisation] = useState(false);
  const [showLegalSpecialisation, setShowLegalSpecialisation] = useState(false);
  const [showManufacturingSpecialisation, setShowManufacturingSpecialisation] = useState(false);
  const [showEnergySpecialisation, setShowEnergySpecialisation] = useState(false);
  const [showPharmaSpecialisation, setShowPharmaSpecialisation] = useState(false);
  const [showRDSpecialisation, setShowRDSpecialisation] = useState(false);
  const [showSalesSpecialisation, setShowSalesSpecialisation] = useState(false);
  const [selectedSpecialisation, setSelectedSpecialisation] = useState<string>("");
  const [availableTitles, setAvailableTitles] = useState<string[]>([]);

  const handleWorkAreaChange = (value: string) => {
    setShowOtherInput(false);
    setShowITSpecialisation(false);
    setShowCustomerServiceSpecialisation(false);
    setShowFinanceSpecialisation(false);
    setShowPublicSectorSpecialisation(false);
    setShowEngineeringSpecialisation(false);
    setShowHospitalitySpecialisation(false);
    setShowHRSpecialisation(false);
    setShowLegalSpecialisation(false);
    setShowManufacturingSpecialisation(false);
    setShowEnergySpecialisation(false);
    setShowPharmaSpecialisation(false);
    setShowRDSpecialisation(false);
    setShowSalesSpecialisation(false);

    switch (value) {
      case "IT":
        setShowITSpecialisation(true);
        break;
      case "Customer Service":
        setShowCustomerServiceSpecialisation(true);
        break;
      case "Accounting & Finance":
        setShowFinanceSpecialisation(true);
        break;
      case "Public Sector":
        setShowPublicSectorSpecialisation(true);
        break;
      case "Engineering":
        setShowEngineeringSpecialisation(true);
        break;
      case "Hospitality & Tourism":
        setShowHospitalitySpecialisation(true);
        break;
      case "Human Resources":
        setShowHRSpecialisation(true);
        break;
      case "Legal":
        setShowLegalSpecialisation(true);
        break;
      case "Manufacturing":
        setShowManufacturingSpecialisation(true);
        break;
      case "Energy & Utilities":
        setShowEnergySpecialisation(true);
        break;
      case "Pharma":
        setShowPharmaSpecialisation(true);
        break;
      case "R&D":
        setShowRDSpecialisation(true);
        break;
      case "Sales":
        setShowSalesSpecialisation(true);
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
    if (showITSpecialisation) {
      titles = getTitlesForITSpecialisation(specialisation);
    } else if (showCustomerServiceSpecialisation) {
      titles = getTitlesForCustomerServiceSpecialisation(specialisation);
    } else if (showFinanceSpecialisation) {
      titles = getTitlesForFinanceSpecialisation(specialisation);
    } else if (showPublicSectorSpecialisation) {
      titles = getTitlesForPublicSectorSpecialisation(specialisation);
    } else if (showEngineeringSpecialisation) {
      titles = getTitlesForEngineeringSpecialisation(specialisation);
    } else if (showHospitalitySpecialisation) {
      titles = getTitlesForHospitalitySpecialisation(specialisation);
    } else if (showRDSpecialisation) {
      titles = getTitlesForRDSpecialisation(specialisation);
    } else if (showSalesSpecialisation) {
      titles = getTitlesForSalesSpecialisation(specialisation);
    }
    setAvailableTitles(titles);
  };

  return (
    <div className="space-y-4">
      <WorkAreaSelect 
        control={control}
        onWorkAreaChange={handleWorkAreaChange}
      />

      {showITSpecialisation && (
        <ITSpecialisationSelect 
          control={control}
          onSpecializationChange={handleSpecialisationChange}
        />
      )}

      {showCustomerServiceSpecialisation && (
        <CustomerServiceSpecializationSelect 
          control={control}
          onSpecializationChange={handleSpecialisationChange}
        />
      )}

      {showFinanceSpecialisation && (
        <FinanceSpecializationSelect
          control={control}
          onSpecializationChange={handleSpecialisationChange}
        />
      )}

      {showPublicSectorSpecialisation && (
        <PublicSectorSpecializationSelect
          control={control}
          onSpecializationChange={handleSpecialisationChange}
        />
      )}

      {showEngineeringSpecialisation && (
        <EngineeringSpecializationSelect
          control={control}
          onSpecializationChange={handleSpecialisationChange}
        />
      )}

      {showHospitalitySpecialisation && (
        <HospitalitySpecializationSelect
          control={control}
          onSpecializationChange={handleSpecialisationChange}
        />
      )}

      {showHRSpecialisation && (
        <HRSpecializationSelect
          control={control}
          onSpecializationChange={handleSpecialisationChange}
        />
      )}

      {showLegalSpecialisation && (
        <LegalSpecializationSelect
          control={control}
          onSpecializationChange={handleSpecialisationChange}
        />
      )}

      {showManufacturingSpecialisation && (
        <ManufacturingSpecializationSelect
          control={control}
          onSpecializationChange={handleSpecialisationChange}
        />
      )}

      {showEnergySpecialisation && (
        <EnergySpecializationSelect
          control={control}
          onSpecializationChange={handleSpecialisationChange}
        />
      )}

      {showPharmaSpecialisation && (
        <PharmaSpecializationSelect
          control={control}
          onSpecializationChange={handleSpecialisationChange}
        />
      )}

      {showRDSpecialisation && (
        <RDSpecializationSelect
          control={control}
          onSpecializationChange={handleSpecialisationChange}
        />
      )}

      {showSalesSpecialisation && (
        <SalesSpecializationSelect
          control={control}
          onSpecializationChange={handleSpecialisationChange}
        />
      )}

      {selectedSpecialisation && availableTitles.length > 0 && (
        <JobTitleSelect
          control={control}
          titles={availableTitles}
          name="title"
        />
      )}

      <OtherFields control={control} visible={showOtherInput} />
    </div>
  );
};

export default WorkAreaField;
