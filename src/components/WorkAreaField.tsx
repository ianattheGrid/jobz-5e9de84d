import { useState } from "react";
import { Control } from "react-hook-form";
import WorkAreaSelect from "./work-area/selectors/WorkAreaSelect";
import { 
  getTitlesForITSpecialization,
  getTitlesForCustomerServiceSpecialization,
  getTitlesForFinanceSpecialization,
  getTitlesForPublicSectorSpecialization,
  getTitlesForEngineeringSpecialization,
  getTitlesForHospitalitySpecialization,
  getTitlesForRDSpecialization,
  getTitlesForSalesSpecialization
} from "./work-area/utils/getTitlesForSpecialization";
import ITSpecializationSelect from "./work-area/specializations/ITSpecializationSelect";
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
  const [showITSpecialization, setShowITSpecialization] = useState(false);
  const [showCustomerServiceSpecialization, setShowCustomerServiceSpecialization] = useState(false);
  const [showFinanceSpecialization, setShowFinanceSpecialization] = useState(false);
  const [showPublicSectorSpecialization, setShowPublicSectorSpecialization] = useState(false);
  const [showEngineeringSpecialization, setShowEngineeringSpecialization] = useState(false);
  const [showHospitalitySpecialization, setShowHospitalitySpecialization] = useState(false);
  const [showHRSpecialization, setShowHRSpecialization] = useState(false);
  const [showLegalSpecialization, setShowLegalSpecialization] = useState(false);
  const [showManufacturingSpecialization, setShowManufacturingSpecialization] = useState(false);
  const [showEnergySpecialization, setShowEnergySpecialization] = useState(false);
  const [showPharmaSpecialization, setShowPharmaSpecialization] = useState(false);
  const [showRDSpecialization, setShowRDSpecialization] = useState(false);
  const [showSalesSpecialization, setShowSalesSpecialization] = useState(false);
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>("");
  const [availableTitles, setAvailableTitles] = useState<string[]>([]);

  const handleWorkAreaChange = (value: string) => {
    // Reset all specialization states
    setShowOtherInput(false);
    setShowITSpecialization(false);
    setShowCustomerServiceSpecialization(false);
    setShowFinanceSpecialization(false);
    setShowPublicSectorSpecialization(false);
    setShowEngineeringSpecialization(false);
    setShowHospitalitySpecialization(false);
    setShowHRSpecialization(false);
    setShowLegalSpecialization(false);
    setShowManufacturingSpecialization(false);
    setShowEnergySpecialization(false);
    setShowPharmaSpecialization(false);
    setShowRDSpecialization(false);
    setShowSalesSpecialization(false);

    // Set the appropriate specialization based on work area
    switch (value) {
      case "IT":
        setShowITSpecialization(true);
        break;
      case "Customer Service":
        setShowCustomerServiceSpecialization(true);
        break;
      case "Accounting & Finance":
        setShowFinanceSpecialization(true);
        break;
      case "Public Sector":
        setShowPublicSectorSpecialization(true);
        break;
      case "Engineering":
        setShowEngineeringSpecialization(true);
        break;
      case "Hospitality & Tourism":
        setShowHospitalitySpecialization(true);
        break;
      case "Human Resources":
        setShowHRSpecialization(true);
        break;
      case "Legal":
        setShowLegalSpecialization(true);
        break;
      case "Manufacturing":
        setShowManufacturingSpecialization(true);
        break;
      case "Energy & Utilities":
        setShowEnergySpecialization(true);
        break;
      case "Pharma":
        setShowPharmaSpecialization(true);
        break;
      case "R&D":
        setShowRDSpecialization(true);
        break;
      case "Sales":
        setShowSalesSpecialization(true);
        break;
      case "Other":
        setShowOtherInput(true);
        break;
    }

    setSelectedSpecialization("");
    setAvailableTitles([]);
    control._formValues.title = "";
  };

  const handleSpecializationChange = (specialization: string) => {
    setSelectedSpecialization(specialization);
    control._formValues.title = "";
    
    let titles: string[] = [];
    if (showITSpecialization) {
      titles = getTitlesForITSpecialization(specialization);
    } else if (showCustomerServiceSpecialization) {
      titles = getTitlesForCustomerServiceSpecialization(specialization);
    } else if (showFinanceSpecialization) {
      titles = getTitlesForFinanceSpecialization(specialization);
    } else if (showPublicSectorSpecialization) {
      titles = getTitlesForPublicSectorSpecialization(specialization);
    } else if (showEngineeringSpecialization) {
      titles = getTitlesForEngineeringSpecialization(specialization);
    } else if (showHospitalitySpecialization) {
      titles = getTitlesForHospitalitySpecialization(specialization);
    } else if (showRDSpecialization) {
      titles = getTitlesForRDSpecialization(specialization);
    } else if (showSalesSpecialization) {
      titles = getTitlesForSalesSpecialization(specialization);
    }
    setAvailableTitles(titles);
  };

  return (
    <div className="space-y-4">
      <WorkAreaSelect 
        control={control}
        onWorkAreaChange={handleWorkAreaChange}
      />

      {showITSpecialization && (
        <ITSpecializationSelect 
          control={control}
          onSpecializationChange={handleSpecializationChange}
        />
      )}

      {showCustomerServiceSpecialization && (
        <CustomerServiceSpecializationSelect 
          control={control}
          onSpecializationChange={handleSpecializationChange}
        />
      )}

      {showFinanceSpecialization && (
        <FinanceSpecializationSelect
          control={control}
          onSpecializationChange={handleSpecializationChange}
        />
      )}

      {showPublicSectorSpecialization && (
        <PublicSectorSpecializationSelect
          control={control}
          onSpecializationChange={handleSpecializationChange}
        />
      )}

      {showEngineeringSpecialization && (
        <EngineeringSpecializationSelect
          control={control}
          onSpecializationChange={handleSpecializationChange}
        />
      )}

      {showHospitalitySpecialization && (
        <HospitalitySpecializationSelect
          control={control}
          onSpecializationChange={handleSpecializationChange}
        />
      )}

      {showHRSpecialization && (
        <HRSpecializationSelect
          control={control}
          onSpecializationChange={handleSpecializationChange}
        />
      )}

      {showLegalSpecialization && (
        <LegalSpecializationSelect
          control={control}
          onSpecializationChange={handleSpecializationChange}
        />
      )}

      {showManufacturingSpecialization && (
        <ManufacturingSpecializationSelect
          control={control}
          onSpecializationChange={handleSpecializationChange}
        />
      )}

      {showEnergySpecialization && (
        <EnergySpecializationSelect
          control={control}
          onSpecializationChange={handleSpecializationChange}
        />
      )}

      {showPharmaSpecialization && (
        <PharmaSpecializationSelect
          control={control}
          onSpecializationChange={handleSpecializationChange}
        />
      )}

      {showRDSpecialization && (
        <RDSpecializationSelect
          control={control}
          onSpecializationChange={handleSpecializationChange}
        />
      )}

      {showSalesSpecialization && (
        <SalesSpecializationSelect
          control={control}
          onSpecializationChange={handleSpecializationChange}
        />
      )}

      {selectedSpecialization && availableTitles.length > 0 && (
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
