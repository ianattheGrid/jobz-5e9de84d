import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { workAreas } from "./work-area/constants";
import ITSpecializationSelect from "./work-area/ITSpecializationSelect";
import JobTitleSelect from "./work-area/JobTitleSelect";
import OtherWorkAreaInput from "./work-area/OtherWorkAreaInput";
import ExperienceSelect from "./work-area/ExperienceSelect";
import { useWorkAreaState } from "./work-area/useWorkAreaState";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
    resetITTitles,
    showCareerChange,
    setShowCareerChange,
    wantsCareerChange,
    setWantsCareerChange
  } = useWorkAreaState();

  const jobTitle = control._formValues.title;
  const yearsExperience = control._formValues.yearsExperience;

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="workArea"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Current Area of Work</FormLabel>
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
                  <SelectValue placeholder="Select your current area of work" />
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

      {jobTitle && !showOtherInput && (
        <ExperienceSelect control={control} jobTitle={jobTitle} />
      )}

      {jobTitle && yearsExperience && (
        <FormField
          control={control}
          name="wantsCareerChange"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Are you looking to change your job title for your next role?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => {
                    field.onChange(value);
                    setWantsCareerChange(value === "yes");
                    setShowCareerChange(value === "yes");
                  }}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="yes" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Yes, I want to change my job title
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="no" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      No, I want to continue in my current role
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {wantsCareerChange && showCareerChange && (
        <>
          <FormField
            control={control}
            name="desired_job_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Desired Job Title</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="What role would you like to move into next?" 
                    className="bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {control._formValues.desired_job_title && (
            <FormField
              control={control}
              name="desired_years_experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years experience in {control._formValues.desired_job_title}</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select years of experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">No experience</SelectItem>
                        <SelectItem value="1-2">1-2 years</SelectItem>
                        <SelectItem value="3-4">3-4 years</SelectItem>
                        <SelectItem value="5-6">5-6 years</SelectItem>
                        <SelectItem value="7-8">7-8 years</SelectItem>
                        <SelectItem value="9-10">9-10 years</SelectItem>
                        <SelectItem value="10+">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </>
      )}
    </div>
  );
};

export default WorkAreaField;