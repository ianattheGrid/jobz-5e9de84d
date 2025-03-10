
import { useState } from 'react';
import { SpecializationStates, SpecializationSetters } from './useSpecializationState.d';

export const useSpecializationState = () => {
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
  const [showQASpecialisation, setShowQASpecialisation] = useState(false);
  const [selectedSpecialisation, setSelectedSpecialisation] = useState<string>("");
  const [availableTitles, setAvailableTitles] = useState<string[]>([]);

  const resetAllSpecialisations = () => {
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
    setShowQASpecialisation(false);
    setAvailableTitles([]);
  };

  const states: SpecializationStates = {
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
    showQASpecialisation,
    selectedSpecialisation,
    availableTitles,
  };

  const setters: SpecializationSetters = {
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
    setShowQASpecialisation,
    setSelectedSpecialisation,
    setAvailableTitles,
  };

  return {
    states,
    setters,
    resetAllSpecialisations,
  };
};

export type UseSpecializationStateReturn = ReturnType<typeof useSpecializationState>;
