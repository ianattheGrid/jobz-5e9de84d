
import { Control, useWatch } from "react-hook-form";
import { useEffect } from "react";
import WorkAreaSelect from "./work-area/selectors/WorkAreaSelect";
import { useWorkAreaHandler } from "./work-area/hooks/useWorkAreaHandler";
import { SpecializationSelects } from "./work-area/components/SpecializationSelects";
import JobTitleSelect from "./work-area/JobTitleSelect";
import OtherFields from "./work-area/fields/OtherFields";
import JobTitleExperienceFields from "./work-area/JobTitleExperienceFields";

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

  // Watch job_title and workArea fields
  const jobTitle = useWatch({ 
    control,
    name: 'job_title'
  });
  
  const workArea = useWatch({
    control,
    name: 'workArea'
  });
  
  const itSpecialization = useWatch({
    control,
    name: 'itSpecialization'
  });
  
  // Debug logged data
  useEffect(() => {
    console.log("WorkAreaField data:", { 
      jobTitle, 
      workArea, 
      itSpecialization, 
      showSpecializations, 
      availableTitles
    });
  }, [jobTitle, workArea, itSpecialization, showSpecializations, availableTitles]);

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

      {/* Always show job title if we have a work area selected */}
      {workArea && (
        <>
          <JobTitleSelect
            control={control}
            titles={availableTitles}
            name="job_title"
          />
          
          {/* Replace single experience field with multi-title experience fields */}
          {Array.isArray(jobTitle) && jobTitle.length > 0 && (
            <JobTitleExperienceFields
              control={control}
              jobTitles={jobTitle}
            />
          )}
        </>
      )}

      <OtherFields control={control} visible={showOtherInput} />
    </div>
  );
};

export default WorkAreaField;
