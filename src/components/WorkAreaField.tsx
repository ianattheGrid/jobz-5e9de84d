import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { useState } from "react";
import { 
  workAreas, 
  softwareDevTitles, 
  itSupportTitles, 
  networkingTitles, 
  cybersecurityTitles,
  dataAnalyticsTitles,
  cloudComputingTitles,
  aiTitles,
  testingTitles 
} from "./work-area/constants";
import ITSpecializationSelect from "./work-area/ITSpecializationSelect";
import JobTitleSelect from "./work-area/JobTitleSelect";

const WorkAreaField = ({ control }: { control: Control<any> }) => {
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

  const handleSpecializationChange = (value: string) => {
    setShowSoftwareDevTitles(value === "Software Development and Programming");
    setShowITSupportTitles(value === "IT Support and Operations");
    setShowNetworkingTitles(value === "Networking and Infrastructure");
    setShowCybersecurityTitles(value === "Cybersecurity");
    setShowDataAnalyticsTitles(value === "Data and Analytics");
    setShowCloudComputingTitles(value === "Cloud Computing");
    setShowAITitles(value === "Artificial Intelligence and Machine Learning");
    setShowTestingTitles(value === "Testing and Quality Assurance");
  };

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
                    setShowSoftwareDevTitles(false);
                    setShowITSupportTitles(false);
                    setShowNetworkingTitles(false);
                    setShowCybersecurityTitles(false);
                    setShowDataAnalyticsTitles(false);
                    setShowCloudComputingTitles(false);
                    setShowAITitles(false);
                    setShowTestingTitles(false);
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

      {showOtherInput && (
        <FormField
          control={control}
          name="otherWorkArea"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Please specify the area of work</FormLabel>
              <FormControl>
                <Input placeholder="Enter the area of work..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default WorkAreaField;