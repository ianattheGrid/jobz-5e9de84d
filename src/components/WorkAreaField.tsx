import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { 
  workAreas, 
  itSpecializations,
  customerServiceSpecializations,
  softwareDevTitles,
  itSupportTitles,
  networkingTitles,
  cybersecurityTitles,
  dataAnalyticsTitles,
  cloudComputingTitles,
  aiTitles,
  testingTitles,
  itManagementTitles,
  specializedITTitles,
  customerSupportTitles,
  customerExperienceTitles,
  customerServiceManagementTitles,
  salesRetentionTitles,
  specializedCustomerServiceTitles,
  technicalSupportTitles
} from "./work-area/constants";
import ITSpecializationSelect from "./work-area/ITSpecializationSelect";
import CustomerServiceSpecializationSelect from "./work-area/CustomerServiceSpecializationSelect";
import JobTitleSelect from "./work-area/JobTitleSelect";
import OtherWorkAreaInput from "./work-area/OtherWorkAreaInput";
import ExperienceSelect from "./work-area/ExperienceSelect";
import CareerChangeSection from "./work-area/CareerChangeSection";
import { useWorkAreaState } from "./work-area/useWorkAreaState";

interface WorkAreaFieldProps {
  control: Control<any>;
}

const WorkAreaField = ({ control }: WorkAreaFieldProps) => {
  const {
    showOtherInput,
    setShowOtherInput,
    showITSpecialization,
    setShowITSpecialization,
    showCustomerServiceSpecialization,
    setShowCustomerServiceSpecialization,
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
    showCustomerSupportTitles,
    showCustomerExperienceTitles,
    showCustomerServiceManagementTitles,
    showSalesRetentionTitles,
    showSpecializedCustomerServiceTitles,
    showTechnicalSupportTitles,
    handleSpecializationChange,
    handleCustomerServiceSpecializationChange,
    resetITTitles,
    resetCustomerServiceTitles,
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
                  setShowCustomerServiceSpecialization(value === "Customer Service");
                  if (value !== "IT") {
                    resetITTitles();
                  }
                  if (value !== "Customer Service") {
                    resetCustomerServiceTitles();
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

      {showCustomerServiceSpecialization && (
        <CustomerServiceSpecializationSelect 
          control={control}
          onSpecializationChange={handleCustomerServiceSpecializationChange}
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

      {showCustomerSupportTitles && (
        <JobTitleSelect control={control} titles={customerSupportTitles} />
      )}

      {showCustomerExperienceTitles && (
        <JobTitleSelect control={control} titles={customerExperienceTitles} />
      )}

      {showCustomerServiceManagementTitles && (
        <JobTitleSelect control={control} titles={customerServiceManagementTitles} />
      )}

      {showSalesRetentionTitles && (
        <JobTitleSelect control={control} titles={salesRetentionTitles} />
      )}

      {showSpecializedCustomerServiceTitles && (
        <JobTitleSelect control={control} titles={specializedCustomerServiceTitles} />
      )}

      {showTechnicalSupportTitles && (
        <JobTitleSelect control={control} titles={technicalSupportTitles} />
      )}

      {showOtherInput && (
        <OtherWorkAreaInput control={control} />
      )}

      {jobTitle && !showOtherInput && (
        <ExperienceSelect control={control} jobTitle={jobTitle} />
      )}

      <CareerChangeSection
        control={control}
        showCareerChange={jobTitle && yearsExperience ? true : false}
        wantsCareerChange={wantsCareerChange}
        onCareerChangeResponse={(value) => {
          setWantsCareerChange(value === "yes");
          setShowCareerChange(value === "yes");
        }}
      />
    </div>
  );
};

export default WorkAreaField;