import { Control } from "react-hook-form";
import ITSpecializationSelect from "./ITSpecializationSelect";
import JobTitleSelect from "./JobTitleSelect";
import { useState } from "react";
import { itRoles } from "./constants";
import CareerChangeRadio from "./career-change/CareerChangeRadio";
import DesiredWorkArea from "./career-change/DesiredWorkArea";
import DesiredExperience from "./career-change/DesiredExperience";
import DesiredOtherWorkArea from "./career-change/DesiredOtherWorkArea";

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

  const handleWorkAreaChange = (value: string) => {
    setShowOtherInput(value === "Other");
    setShowITSpecialization(value === "IT");
  };

  if (!showCareerChange) return null;

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <CareerChangeRadio 
        control={control}
        onCareerChangeResponse={onCareerChangeResponse}
      />

      {wantsCareerChange && (
        <>
          <DesiredWorkArea 
            control={control}
            onWorkAreaChange={handleWorkAreaChange}
          />

          {showITSpecialization && (
            <ITSpecializationSelect 
              control={control}
              onSpecializationChange={handleSpecializationChange}
            />
          )}

          {showSoftwareDevTitles && (
            <JobTitleSelect control={control} titles={itRoles.softwareDevTitles} name="desired_job_title" />
          )}

          {showITSupportTitles && (
            <JobTitleSelect control={control} titles={itRoles.itSupportTitles} name="desired_job_title" />
          )}

          {showNetworkingTitles && (
            <JobTitleSelect control={control} titles={itRoles.networkingTitles} name="desired_job_title" />
          )}

          {showCybersecurityTitles && (
            <JobTitleSelect control={control} titles={itRoles.cybersecurityTitles} name="desired_job_title" />
          )}

          {showDataAnalyticsTitles && (
            <JobTitleSelect control={control} titles={itRoles.dataAnalyticsTitles} name="desired_job_title" />
          )}

          {showCloudComputingTitles && (
            <JobTitleSelect control={control} titles={itRoles.cloudComputingTitles} name="desired_job_title" />
          )}

          {showAITitles && (
            <JobTitleSelect control={control} titles={itRoles.aiTitles} name="desired_job_title" />
          )}

          {showTestingTitles && (
            <JobTitleSelect control={control} titles={itRoles.testingTitles} name="desired_job_title" />
          )}

          {showITManagementTitles && (
            <JobTitleSelect control={control} titles={itRoles.itManagementTitles} name="desired_job_title" />
          )}

          {showSpecializedITTitles && (
            <JobTitleSelect control={control} titles={itRoles.specializedITTitles} name="desired_job_title" />
          )}

          {showOtherInput && (
            <DesiredOtherWorkArea control={control} />
          )}

          {control._formValues.desired_job_title && (
            <DesiredExperience 
              control={control}
              jobTitle={control._formValues.desired_job_title}
            />
          )}
        </>
      )}
    </div>
  );
};

export default CareerChangeSection;
