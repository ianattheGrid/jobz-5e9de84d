import { useState } from "react";

export const useWorkAreaState = () => {
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

  const resetITTitles = () => {
    setShowSoftwareDevTitles(false);
    setShowITSupportTitles(false);
    setShowNetworkingTitles(false);
    setShowCybersecurityTitles(false);
    setShowDataAnalyticsTitles(false);
    setShowCloudComputingTitles(false);
    setShowAITitles(false);
    setShowTestingTitles(false);
    setShowITManagementTitles(false);
    setShowSpecializedITTitles(false);
  };

  return {
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
  };
};