import { useState } from "react";
import { Control } from "react-hook-form";
import WorkAreaSelect from "./work-area/selectors/WorkAreaSelect";
import ITSpecializationSelect from "./work-area/specializations/ITSpecializationSelect";
import CustomerServiceSpecializationSelect from "./work-area/specializations/CustomerServiceSpecializationSelect";
import FinanceSpecializationSelect from "./work-area/specializations/FinanceSpecializationSelect";
import PublicSectorSpecializationSelect from "./work-area/specializations/PublicSectorSpecializationSelect";
import EngineeringSpecializationSelect from "./work-area/specializations/EngineeringSpecializationSelect";
import HospitalitySpecializationSelect from "./work-area/specializations/HospitalitySpecializationSelect";
import JobTitleSelect from "./work-area/JobTitleSelect";
import PharmaFields from "./work-area/fields/PharmaFields";
import OtherFields from "./work-area/fields/OtherFields";
import {
  getTitlesForITSpecialization,
  getTitlesForCustomerServiceSpecialization,
  getTitlesForFinanceSpecialization,
  getTitlesForPublicSectorSpecialization,
  getTitlesForEngineeringSpecialization,
  getTitlesForHospitalitySpecialization
} from "./work-area/utils/getTitlesForSpecialization";

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
  const [showPharmaFields, setShowPharmaFields] = useState(false);
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>("");
  const [availableTitles, setAvailableTitles] = useState<string[]>([]);

  const handleWorkAreaChange = (value: string) => {
    setShowOtherInput(value === "Other");
    setShowITSpecialization(value === "IT");
    setShowCustomerServiceSpecialization(value === "Customer Service");
    setShowFinanceSpecialization(value === "Accounting & Finance");
    setShowPublicSectorSpecialization(value === "Public Sector");
    setShowEngineeringSpecialization(value === "Engineering");
    setShowHospitalitySpecialization(value === "Hospitality & Tourism");
    setShowPharmaFields(value === "Pharma");
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

      {selectedSpecialization && availableTitles.length > 0 && (
        <JobTitleSelect
          control={control}
          titles={availableTitles}
        />
      )}

      <PharmaFields control={control} visible={showPharmaFields} />
      <OtherFields control={control} visible={showOtherInput} />
    </div>
  );
};

export default WorkAreaField;