
import { Control } from "react-hook-form";
import WorkAreaSelect from "./selectors/WorkAreaSelect";
import { useWorkAreaHandler } from "./hooks/useWorkAreaHandler";
import { SpecializationSelects } from "./components/SpecializationSelects";
import JobTitleSelect from "./JobTitleSelect";
import OtherFields from "./fields/OtherFields";

interface WorkAreaFieldProps {
  control: Control<any>;
}

const WorkAreaField = ({ control }: WorkAreaFieldProps) => {
  const {
    showOtherInput,
    showSpecializations,
    selectedSpecialisation,
    availableTitles,
    handleWorkAreaChange,
    handleSpecialisationChange
  } = useWorkAreaHandler(control);

  return (
    <div className="space-y-4">
      <WorkAreaSelect 
        control={control}
        onWorkAreaChange={handleWorkAreaChange}
      />

      <SpecializationSelects
        control={control}
        showSpecializations={showSpecializations}
        onSpecialisationChange={handleSpecialisationChange}
      />

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
