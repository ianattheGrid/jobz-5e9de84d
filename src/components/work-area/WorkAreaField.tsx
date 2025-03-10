
import { Control } from "react-hook-form";
import WorkAreaSelect from "./selectors/WorkAreaSelect";
import { useSpecializationState } from "./hooks/useSpecializationState";
import { handleWorkAreaChange } from "./utils/handleWorkAreaChange";
import { handleSpecializationChange } from "./utils/handleSpecializationChange";
import ITSpecializationSelect from "./specializations/ITSpecializationSelect";
import CustomerServiceSpecializationSelect from "./specializations/CustomerServiceSpecializationSelect";
import FinanceSpecializationSelect from "./specializations/FinanceSpecializationSelect";
import PublicSectorSpecializationSelect from "./specializations/PublicSectorSpecializationSelect";
import EngineeringSpecializationSelect from "./specializations/EngineeringSpecializationSelect";
import HospitalitySpecializationSelect from "./specializations/HospitalitySpecializationSelect";
import HRSpecializationSelect from "./specializations/HRSpecializationSelect";
import LegalSpecializationSelect from "./specializations/LegalSpecializationSelect";
import ManufacturingSpecializationSelect from "./specializations/ManufacturingSpecializationSelect";
import EnergySpecializationSelect from "./specializations/EnergySpecializationSelect";
import PharmaSpecializationSelect from "./specializations/PharmaSpecializationSelect";
import RDSpecializationSelect from "./specializations/RDSpecializationSelect";
import SalesSpecializationSelect from "./specializations/SalesSpecializationSelect";
import JobTitleSelect from "./JobTitleSelect";
import OtherFields from "./fields/OtherFields";

interface WorkAreaFieldProps {
  control: Control<any>;
}

const WorkAreaField = ({ control }: WorkAreaFieldProps) => {
  const specializationState = useSpecializationState(control);
  const { states, setters } = specializationState;

  const onWorkAreaChange = (value: string) => {
    handleWorkAreaChange(value, specializationState);
  };

  const onSpecializationChange = (specialization: string) => {
    handleSpecializationChange(specialization, control, specializationState);
  };

  return (
    <div className="space-y-4">
      <WorkAreaSelect 
        control={control}
        onWorkAreaChange={onWorkAreaChange}
      />

      {states.showITSpecialization && (
        <ITSpecializationSelect 
          control={control}
          onSpecializationChange={onSpecializationChange}
        />
      )}

      {states.showCustomerServiceSpecialization && (
        <CustomerServiceSpecializationSelect 
          control={control}
          onSpecializationChange={onSpecializationChange}
        />
      )}

      {states.showFinanceSpecialization && (
        <FinanceSpecializationSelect
          control={control}
          onSpecializationChange={onSpecializationChange}
        />
      )}

      {states.showPublicSectorSpecialization && (
        <PublicSectorSpecializationSelect
          control={control}
          onSpecializationChange={onSpecializationChange}
        />
      )}

      {states.showEngineeringSpecialization && (
        <EngineeringSpecializationSelect
          control={control}
          onSpecializationChange={onSpecializationChange}
        />
      )}

      {states.showHospitalitySpecialization && (
        <HospitalitySpecializationSelect
          control={control}
          onSpecializationChange={onSpecializationChange}
        />
      )}

      {states.showHRSpecialization && (
        <HRSpecializationSelect
          control={control}
          onSpecializationChange={onSpecializationChange}
        />
      )}

      {states.showLegalSpecialization && (
        <LegalSpecializationSelect
          control={control}
          onSpecializationChange={onSpecializationChange}
        />
      )}

      {states.showManufacturingSpecialization && (
        <ManufacturingSpecializationSelect
          control={control}
          onSpecializationChange={onSpecializationChange}
        />
      )}

      {states.showEnergySpecialization && (
        <EnergySpecializationSelect
          control={control}
          onSpecializationChange={onSpecializationChange}
        />
      )}

      {states.showPharmaSpecialization && (
        <PharmaSpecializationSelect
          control={control}
          onSpecializationChange={onSpecializationChange}
        />
      )}

      {states.showRDSpecialization && (
        <RDSpecializationSelect
          control={control}
          onSpecializationChange={onSpecializationChange}
        />
      )}

      {states.showSalesSpecialization && (
        <SalesSpecializationSelect
          control={control}
          onSpecializationChange={onSpecializationChange}
        />
      )}

      {states.selectedSpecialization && states.availableTitles.length > 0 && (
        <JobTitleSelect
          control={control}
          titles={states.availableTitles}
          name="title"
        />
      )}

      <OtherFields control={control} visible={states.showOtherInput} />
    </div>
  );
};

export default WorkAreaField;
