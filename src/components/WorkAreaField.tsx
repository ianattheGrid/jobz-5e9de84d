
import { Control, useWatch } from "react-hook-form";
import { useEffect } from "react";
import WorkAreaSelect from "./work-area/selectors/WorkAreaSelect";
import { useWorkAreaHandler } from "./work-area/hooks/useWorkAreaHandler";
import { SpecializationSelects } from "./work-area/components/SpecializationSelects";
import JobTitleSelect from "./work-area/JobTitleSelect";
import OtherFields from "./work-area/fields/OtherFields";
import TitleExperienceSelect from "./work-area/TitleExperienceSelect";

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

  // Watch job_title field to know when we have a valid title
  const jobTitle = useWatch({ 
    control,
    name: 'job_title'
  });

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

      {/* Show job title either when we have specialization + titles OR when we already have a job title */}
      {((selectedSpecialisation && availableTitles.length > 0) || jobTitle) && (
        <>
          <JobTitleSelect
            control={control}
            titles={availableTitles.length > 0 ? availableTitles : [jobTitle]}
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
