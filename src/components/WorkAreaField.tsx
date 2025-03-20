
import { Control } from "react-hook-form";
import WorkAreaSelect from "./work-area/selectors/WorkAreaSelect";
import { useWorkAreaHandler } from "./work-area/hooks/useWorkAreaHandler";
import { SpecializationSelects } from "./work-area/components/SpecializationSelects";
import JobTitleSelect from "./work-area/JobTitleSelect";
import OtherFields from "./work-area/fields/OtherFields";
import TitleExperienceSelect from "./work-area/TitleExperienceSelect";
import { useEffect } from "react";

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
        <>
          <JobTitleSelect
            control={control}
            titles={availableTitles}
            name="job_title"
          />
          <TitleExperienceSelect
            control={control}
            name="years_in_current_title"
            label="Years of experience in this job title"
          />
        </>
      )}

      <OtherFields control={control} visible={showOtherInput} />
    </div>
  );
};

export default WorkAreaField;
