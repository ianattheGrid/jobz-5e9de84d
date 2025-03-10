import { useState } from "react";
import { Control } from "react-hook-form";
import { UseSpecializationStateReturn } from "./useSpecializationState.d";

export const useSpecializationState = (control: Control<any>): UseSpecializationStateReturn => {
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [showITSpecialization, setShowITSpecialization] = useState(false);
  const [showCustomerServiceSpecialization, setShowCustomerServiceSpecialization] = useState(false);
  const [showFinanceSpecialization, setShowFinanceSpecialization] = useState(false);
  const [showPublicSectorSpecialization, setShowPublicSectorSpecialization] = useState(false);
  const [showEngineeringSpecialization, setShowEngineeringSpecialization] = useState(false);
  const [showHospitalitySpecialization, setShowHospitalitySpecialization] = useState(false);
  const [showHRSpecialization, setShowHRSpecialization] = useState(false);
  const [showLegalSpecialization, setShowLegalSpecialization] = useState(false);
  const [showManufacturingSpecialization, setShowManufacturingSpecialization] = useState(false);
  const [showEnergySpecialization, setShowEnergySpecialization] = useState(false);
  const [showPharmaSpecialization, setShowPharmaSpecialization] = useState(false);
  const [showRDSpecialization, setShowRDSpecialization] = useState(false);
  const [showSalesSpecialization, setShowSalesSpecialization] = useState(false);
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>("");
  const [availableTitles, setAvailableTitles] = useState<string[]>([]);

  const resetAllSpecializations = () => {
    setShowOtherInput(false);
    setShowITSpecialization(false);
    setShowCustomerServiceSpecialization(false);
    setShowFinanceSpecialization(false);
    setShowPublicSectorSpecialization(false);
    setShowEngineeringSpecialization(false);
    setShowHospitalitySpecialization(false);
    setShowHRSpecialization(false);
    setShowLegalSpecialization(false);
    setShowManufacturingSpecialization(false);
    setShowEnergySpecialization(false);
    setShowPharmaSpecialization(false);
    setShowRDSpecialization(false);
    setShowSalesSpecialization(false);
    setSelectedSpecialization("");
    setAvailableTitles([]);
    control._formValues.title = "";
  };

  return {
    states: {
      showOtherInput,
      showITSpecialization,
      showCustomerServiceSpecialization,
      showFinanceSpecialization,
      showPublicSectorSpecialization,
      showEngineeringSpecialization,
      showHospitalitySpecialization,
      showHRSpecialization,
      showLegalSpecialization,
      showManufacturingSpecialization,
      showEnergySpecialization,
      showPharmaSpecialization,
      showRDSpecialization,
      showSalesSpecialization,
      selectedSpecialization,
      availableTitles
    },
    setters: {
      setShowOtherInput,
      setShowITSpecialization,
      setShowCustomerServiceSpecialization,
      setShowFinanceSpecialization,
      setShowPublicSectorSpecialization,
      setShowEngineeringSpecialization,
      setShowHospitalitySpecialization,
      setShowHRSpecialization,
      setShowLegalSpecialization,
      setShowManufacturingSpecialization,
      setShowEnergySpecialization,
      setShowPharmaSpecialization,
      setShowRDSpecialization,
      setShowSalesSpecialization,
      setSelectedSpecialization,
      setAvailableTitles
    },
    resetAllSpecializations
  };
};

export type { UseSpecializationStateReturn };
