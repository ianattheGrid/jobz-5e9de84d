import { useState } from "react";

export const useWorkAreaState = () => {
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [showITSpecialization, setShowITSpecialization] = useState(false);
  const [showCustomerServiceSpecialization, setShowCustomerServiceSpecialization] = useState(false);
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
  const [showCustomerSupportTitles, setShowCustomerSupportTitles] = useState(false);
  const [showCustomerExperienceTitles, setShowCustomerExperienceTitles] = useState(false);
  const [showCustomerServiceManagementTitles, setShowCustomerServiceManagementTitles] = useState(false);
  const [showSalesRetentionTitles, setShowSalesRetentionTitles] = useState(false);
  const [showSpecializedCustomerServiceTitles, setShowSpecializedCustomerServiceTitles] = useState(false);
  const [showTechnicalSupportTitles, setShowTechnicalSupportTitles] = useState(false);
  const [showCareerChange, setShowCareerChange] = useState(false);
  const [wantsCareerChange, setWantsCareerChange] = useState(false);

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

  const handleCustomerServiceSpecializationChange = (value: string) => {
    setShowCustomerSupportTitles(value === "Customer Support Roles");
    setShowCustomerExperienceTitles(value === "Customer Experience Roles");
    setShowCustomerServiceManagementTitles(value === "Management Roles");
    setShowSalesRetentionTitles(value === "Sales and Retention Roles");
    setShowSpecializedCustomerServiceTitles(value === "Specialised Customer Service Roles");
    setShowTechnicalSupportTitles(value === "Technical and Advanced Support Roles");
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

  const resetCustomerServiceTitles = () => {
    setShowCustomerSupportTitles(false);
    setShowCustomerExperienceTitles(false);
    setShowCustomerServiceManagementTitles(false);
    setShowSalesRetentionTitles(false);
    setShowSpecializedCustomerServiceTitles(false);
    setShowTechnicalSupportTitles(false);
  };

  return {
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
  };
};