
import { Control } from "react-hook-form";
import { Dispatch, SetStateAction } from "react";

export interface SpecializationStates {
  showOtherInput: boolean;
  showITSpecialization: boolean;
  showCustomerServiceSpecialization: boolean;
  showFinanceSpecialization: boolean;
  showPublicSectorSpecialization: boolean;
  showEngineeringSpecialization: boolean;
  showHospitalitySpecialization: boolean;
  showHRSpecialization: boolean;
  showLegalSpecialization: boolean;
  showManufacturingSpecialization: boolean;
  showEnergySpecialization: boolean;
  showPharmaSpecialization: boolean;
  showRDSpecialization: boolean;
  showSalesSpecialization: boolean;
  selectedSpecialization: string;
  availableTitles: string[];
}

export interface SpecializationSetters {
  setShowOtherInput: Dispatch<SetStateAction<boolean>>;
  setShowITSpecialization: Dispatch<SetStateAction<boolean>>;
  setShowCustomerServiceSpecialization: Dispatch<SetStateAction<boolean>>;
  setShowFinanceSpecialization: Dispatch<SetStateAction<boolean>>;
  setShowPublicSectorSpecialization: Dispatch<SetStateAction<boolean>>;
  setShowEngineeringSpecialization: Dispatch<SetStateAction<boolean>>;
  setShowHospitalitySpecialization: Dispatch<SetStateAction<boolean>>;
  setShowHRSpecialization: Dispatch<SetStateAction<boolean>>;
  setShowLegalSpecialization: Dispatch<SetStateAction<boolean>>;
  setShowManufacturingSpecialization: Dispatch<SetStateAction<boolean>>;
  setShowEnergySpecialization: Dispatch<SetStateAction<boolean>>;
  setShowPharmaSpecialization: Dispatch<SetStateAction<boolean>>;
  setShowRDSpecialization: Dispatch<SetStateAction<boolean>>;
  setShowSalesSpecialization: Dispatch<SetStateAction<boolean>>;
  setSelectedSpecialization: Dispatch<SetStateAction<string>>;
  setAvailableTitles: Dispatch<SetStateAction<string[]>>;
}

export interface UseSpecializationStateReturn {
  states: SpecializationStates;
  setters: SpecializationSetters;
  resetAllSpecializations: () => void;
}

export function useSpecializationState(control: Control<any>): UseSpecializationStateReturn;
