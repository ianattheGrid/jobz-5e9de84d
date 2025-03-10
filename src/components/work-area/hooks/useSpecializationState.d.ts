
import { Control } from "react-hook-form";
import { Dispatch, SetStateAction } from "react";

export interface SpecializationStates {
  showOtherInput: boolean;
  showITSpecialisation: boolean;
  showCustomerServiceSpecialisation: boolean;
  showFinanceSpecialisation: boolean;
  showPublicSectorSpecialisation: boolean;
  showEngineeringSpecialisation: boolean;
  showHospitalitySpecialisation: boolean;
  showHRSpecialisation: boolean;
  showLegalSpecialisation: boolean;
  showManufacturingSpecialisation: boolean;
  showEnergySpecialisation: boolean;
  showPharmaSpecialisation: boolean;
  showRDSpecialisation: boolean;
  showSalesSpecialisation: boolean;
  selectedSpecialisation: string;
  availableTitles: string[];
}

export interface SpecializationSetters {
  setShowOtherInput: Dispatch<SetStateAction<boolean>>;
  setShowITSpecialisation: Dispatch<SetStateAction<boolean>>;
  setShowCustomerServiceSpecialisation: Dispatch<SetStateAction<boolean>>;
  setShowFinanceSpecialisation: Dispatch<SetStateAction<boolean>>;
  setShowPublicSectorSpecialisation: Dispatch<SetStateAction<boolean>>;
  setShowEngineeringSpecialisation: Dispatch<SetStateAction<boolean>>;
  setShowHospitalitySpecialisation: Dispatch<SetStateAction<boolean>>;
  setShowHRSpecialisation: Dispatch<SetStateAction<boolean>>;
  setShowLegalSpecialisation: Dispatch<SetStateAction<boolean>>;
  setShowManufacturingSpecialisation: Dispatch<SetStateAction<boolean>>;
  setShowEnergySpecialisation: Dispatch<SetStateAction<boolean>>;
  setShowPharmaSpecialisation: Dispatch<SetStateAction<boolean>>;
  setShowRDSpecialisation: Dispatch<SetStateAction<boolean>>;
  setShowSalesSpecialisation: Dispatch<SetStateAction<boolean>>;
  setSelectedSpecialisation: Dispatch<SetStateAction<string>>;
  setAvailableTitles: Dispatch<SetStateAction<string[]>>;
}

export interface UseSpecializationStateReturn {
  states: SpecializationStates;
  setters: SpecializationSetters;
  resetAllSpecializations: () => void;
}
