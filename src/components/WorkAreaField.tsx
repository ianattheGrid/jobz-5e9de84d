import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { workAreas } from "./work-area/constants";
import ITSpecializationSelect from "./work-area/ITSpecializationSelect";
import JobTitleSelect from "./work-area/JobTitleSelect";
import OtherWorkAreaInput from "./work-area/OtherWorkAreaInput";
import { useWorkAreaState } from "./work-area/useWorkAreaState";
import {
  softwareDevTitles,
  itSupportTitles,
  networkingTitles,
  cybersecurityTitles,
  dataAnalyticsTitles,
  cloudComputingTitles,
  aiTitles,
  testingTitles,
  itManagementTitles,
  specializedITTitles
} from "./work-area/constants";

interface WorkAreaFieldProps {
  control: Control<any>;
}

const WorkAreaField = ({ control }: WorkAreaFieldProps) => {
  const {
    showOtherInput,
    setShowOtherInput,
    showITSpecialization,
    setShowITSpecialization,
    showSoftwareDevTitles,
    showITSupportTitles,
    showNetworkingTitles,
    showCybersecurityTitles,
    showDataAnalyticsTitles,
    showCloudComputingTitles,
    showAITitles,
    showTestingTitles,
    showITManagementTitles,
    showSpecializedITTitles,
    handleSpecializationChange,
    resetITTitles
  } = useWorkAreaState();

  const jobTitle = control._formValues.title;

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="workArea"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Area of Work</FormLabel>
            <FormControl>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  setShowOtherInput(value === "Other");
                  setShowITSpecialization(value === "IT");
                  if (value !== "IT") {
                    resetITTitles();
                  }
                }} 
                defaultValue={field.value}
              >
                <SelectTrigger className="w-full bg-white border border-gray-300">
                  <SelectValue placeholder="Select the area of work" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {workAreas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {showITSpecialization && (
        <ITSpecializationSelect 
          control={control}
          onSpecializationChange={handleSpecializationChange}
        />
      )}

      {showSoftwareDevTitles && (
        <JobTitleSelect control={control} titles={softwareDevTitles} />
      )}

      {showITSupportTitles && (
        <JobTitleSelect control={control} titles={itSupportTitles} />
      )}

      {showNetworkingTitles && (
        <JobTitleSelect control={control} titles={networkingTitles} />
      )}

      {showCybersecurityTitles && (
        <JobTitleSelect control={control} titles={cybersecurityTitles} />
      )}

      {showDataAnalyticsTitles && (
        <JobTitleSelect control={control} titles={dataAnalyticsTitles} />
      )}

      {showCloudComputingTitles && (
        <JobTitleSelect control={control} titles={cloudComputingTitles} />
      )}

      {showAITitles && (
        <JobTitleSelect control={control} titles={aiTitles} />
      )}

      {showTestingTitles && (
        <JobTitleSelect control={control} titles={testingTitles} />
      )}

      {showITManagementTitles && (
        <JobTitleSelect control={control} titles={itManagementTitles} />
      )}

      {showSpecializedITTitles && (
        <JobTitleSelect control={control} titles={specializedITTitles} />
      )}

      {showOtherInput && (
        <OtherWorkAreaInput control={control} />
      )}

      {jobTitle && (
        <FormField
          control={control}
          name="yearsExperience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Required years of experience in {jobTitle}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select required experience" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="0">No experience required</SelectItem>
                  <SelectItem value="1-2">1-2 years</SelectItem>
                  <SelectItem value="3-4">3-4 years</SelectItem>
                  <SelectItem value="5-6">5-6 years</SelectItem>
                  <SelectItem value="7-8">7-8 years</SelectItem>
                  <SelectItem value="9-10">9-10 years</SelectItem>
                  <SelectItem value="11-12">11-12 years</SelectItem>
                  <SelectItem value="13-14">13-14 years</SelectItem>
                  <SelectItem value="15-16">15-16 years</SelectItem>
                  <SelectItem value="17-18">17-18 years</SelectItem>
                  <SelectItem value="19-20">19-20 years</SelectItem>
                  <SelectItem value="20+">20+ years</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default WorkAreaField;