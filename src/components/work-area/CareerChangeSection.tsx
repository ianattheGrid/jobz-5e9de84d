import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Control } from "react-hook-form";
import { workAreas, itSpecializations } from "./constants";
import { useState } from "react";
import ITSpecializationSelect from "./ITSpecializationSelect";
import JobTitleSelect from "./JobTitleSelect";
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
} from "./constants";

interface CareerChangeSectionProps {
  control: Control<any>;
  showCareerChange: boolean;
  wantsCareerChange: boolean;
  onCareerChangeResponse: (value: string) => void;
}

const CareerChangeSection = ({ 
  control, 
  showCareerChange, 
  wantsCareerChange,
  onCareerChangeResponse 
}: CareerChangeSectionProps) => {
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [showITSpecialization, setShowITSpecialization] = useState(false);
  const [showSoftwareDevTitles, setShowSoftwareDevTitles] = useState(false);
  const [showITSupportTitles, setShowITSupportTitles] = useState(false);
  const [showNetworkingTitles, setShowNetworkingTitles] = useState(false);
  const [showCybersecurityTitles, setShowCybersecurityTitles] = useState(false);
  const [showDataAnalyticsTitles, setShowDataAnalyticsTitles] = useState(false);
  const [showCloudComputingTitles, setShowCloudComputingTitles] = useState(false);
  const [showAITitles, setShowAITitles] = useState(false);
  const [showTestingTitles, setShowTestingTitles] = useState(false);
  const [showITManagementTitles, setShowITManagementTitles] = useState(false);
  const [showSpecializedITTitles, setShowSpecializedITTitles] = useState(false);

  const handleSpecializationChange = (value: string) => {
    setShowSoftwareDevTitles(value === "Software Development and Programming");
    setShowITSupportTitles(value === "IT Support and Operations");
    setShowNetworkingTitles(value === "Networking and Infrastructure");
    setShowCybersecurityTitles(value === "Cybersecurity");
    setShowDataAnalyticsTitles(value === "Data and Analytics");
    setShowCloudComputingTitles(value === "Cloud Computing");
    setShowAITitles(value === "Artificial Intelligence and Machine Learning");
    setShowTestingTitles(value === "Testing and Quality Assurance");
    setShowITManagementTitles(value === "IT Management");
    setShowSpecializedITTitles(value === "Specialised IT Roles");
  };

  if (!showCareerChange) return null;

  return (
    <>
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
                  onCareerChangeResponse(value);
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

      {wantsCareerChange && (
        <>
          <FormField
            control={control}
            name="desired_work_area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Desired Area of Work</FormLabel>
                <FormControl>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      setShowOtherInput(value === "Other");
                      setShowITSpecialization(value === "IT");
                    }} 
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full bg-white border border-gray-300">
                      <SelectValue placeholder="Select your desired area of work" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
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
            <JobTitleSelect control={control} titles={softwareDevTitles} name="desired_job_title" />
          )}

          {showITSupportTitles && (
            <JobTitleSelect control={control} titles={itSupportTitles} name="desired_job_title" />
          )}

          {showNetworkingTitles && (
            <JobTitleSelect control={control} titles={networkingTitles} name="desired_job_title" />
          )}

          {showCybersecurityTitles && (
            <JobTitleSelect control={control} titles={cybersecurityTitles} name="desired_job_title" />
          )}

          {showDataAnalyticsTitles && (
            <JobTitleSelect control={control} titles={dataAnalyticsTitles} name="desired_job_title" />
          )}

          {showCloudComputingTitles && (
            <JobTitleSelect control={control} titles={cloudComputingTitles} name="desired_job_title" />
          )}

          {showAITitles && (
            <JobTitleSelect control={control} titles={aiTitles} name="desired_job_title" />
          )}

          {showTestingTitles && (
            <JobTitleSelect control={control} titles={testingTitles} name="desired_job_title" />
          )}

          {showITManagementTitles && (
            <JobTitleSelect control={control} titles={itManagementTitles} name="desired_job_title" />
          )}

          {showSpecializedITTitles && (
            <JobTitleSelect control={control} titles={specializedITTitles} name="desired_job_title" />
          )}

          {showOtherInput && (
            <FormField
              control={control}
              name="desired_other_work_area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Please specify the desired area of work</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the area of work..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

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
                      <SelectContent className="bg-white z-50">
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
    </>
  );
};

export default CareerChangeSection;