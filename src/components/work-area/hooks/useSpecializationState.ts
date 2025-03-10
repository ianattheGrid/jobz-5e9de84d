
import { useState } from "react";
import { Control } from "react-hook-form";
import { UseSpecializationStateReturn } from "./useSpecializationState.d";

export const useSpecializationState = (control: Control<any>): UseSpecializationStateReturn => {
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [showITSpecialisation, setShowITSpecialisation] = useState(false);
  const [showCustomerServiceSpecialisation, setShowCustomerServiceSpecialisation] = useState(false);
  const [showFinanceSpecialisation, setShowFinanceSpecialisation] = useState(false);
  const [showPublicSectorSpecialisation, setShowPublicSectorSpecialisation] = useState(false);
  const [showEngineeringSpecialisation, setShowEngineeringSpecialisation] = useState(false);
  const [showHospitalitySpecialisation, setShowHospitalitySpecialisation] = useState(false);
  const [showHRSpecialisation, setShowHRSpecialisation] = useState(false);
  const [showLegalSpecialisation, setShowLegalSpecialisation] = useState(false);
  const [showManufacturingSpecialisation, setShowManufacturingSpecialisation] = useState(false);
  const [showEnergySpecialisation, setShowEnergySpecialisation] = useState(false);
  const [showPharmaSpecialisation, setShowPharmaSpecialisation] = useState(false);
  const [showRDSpecialisation, setShowRDSpecialisation] = useState(false);
  const [showSalesSpecialisation, setShowSalesSpecialisation] = useState(false);
  const [selectedSpecialisation, setSelectedSpecialisation] = useState<string>("");
  const [availableTitles, setAvailableTitles] = useState<string[]>([]);

  const resetAllSpecializations = () => {
    setShowOtherInput(false);
    setShowITSpecialisation(false);
    setShowCustomerServiceSpecialisation(false);
    setShowFinanceSpecialisation(false);
    setShowPublicSectorSpecialisation(false);
    setShowEngineeringSpecialisation(false);
    setShowHospitalitySpecialisation(false);
    setShowHRSpecialisation(false);
    setShowLegalSpecialisation(false);
    setShowManufacturingSpecialisation(false);
    setShowEnergySpecialisation(false);
    setShowPharmaSpecialisation(false);
    setShowRDSpecialisation(false);
    setShowSalesSpecialisation(false);
    setSelectedSpecialisation("");
    setAvailableTitles([]);
    control._formValues.title = "";
  };

  return {
    states: {
      showOtherInput,
      showITSpecialisation,
      showCustomerServiceSpecialisation,
      showFinanceSpecialisation,
      showPublicSectorSpecialisation,
      showEngineeringSpecialisation,
      showHospitalitySpecialisation,
      showHRSpecialisation,
      showLegalSpecialisation,
      showManufacturingSpecialisation,
      showEnergySpecialisation,
      showPharmaSpecialisation,
      showRDSpecialisation,
      showSalesSpecialisation,
      selectedSpecialisation,
      availableTitles
    },
    setters: {
      setShowOtherInput,
      setShowITSpecialisation,
      setShowCustomerServiceSpecialisation,
      setShowFinanceSpecialisation,
      setShowPublicSectorSpecialisation,
      setShowEngineeringSpecialisation,
      setShowHospitalitySpecialisation,
      setShowHRSpecialisation,
      setShowLegalSpecialisation,
      setShowManufacturingSpecialisation,
      setShowEnergySpecialisation,
      setShowPharmaSpecialisation,
      setShowRDSpecialisation,
      setShowSalesSpecialisation,
      setSelectedSpecialisation,
      setAvailableTitles
    },
    resetAllSpecializations
  };
};

export type { UseSpecializationStateReturn };
