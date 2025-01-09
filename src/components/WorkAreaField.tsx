import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { workAreas } from "./work-area/constants";
import ITSpecializationSelect from "./work-area/ITSpecializationSelect";
import CustomerServiceSpecializationSelect from "./work-area/CustomerServiceSpecializationSelect";
import FinanceSpecializationSelect from "./work-area/FinanceSpecializationSelect";
import HRSpecializationSelect from "./work-area/HRSpecializationSelect";
import LegalSpecializationSelect from "./work-area/LegalSpecializationSelect";
import ManufacturingSpecializationSelect from "./work-area/ManufacturingSpecializationSelect";
import EnergySpecializationSelect from "./work-area/EnergySpecializationSelect";
import PharmaSpecializationSelect from "./work-area/PharmaSpecializationSelect";
import JobTitleSelect from "./work-area/JobTitleSelect";
import OtherWorkAreaInput from "./work-area/OtherWorkAreaInput";
import { useState } from "react";
import {
  pharmaRnDRoles,
  clinicalTrialsRoles,
  pharmaManufacturingRoles,
  qualityAssuranceRoles,
  regulatoryAffairsRoles,
  pharmaSalesRoles,
  medicalWritingRoles,
  pharmaSupplyChainRoles,
  pharmacovigilanceRoles,
  specializedPharmaRoles
} from "./work-area/constants/pharma-roles";

interface WorkAreaFieldProps {
  control: Control<any>;
}

const WorkAreaField = ({ control }: WorkAreaFieldProps) => {
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [showITSpecialization, setShowITSpecialization] = useState(false);
  const [showCustomerServiceSpecialization, setShowCustomerServiceSpecialization] = useState(false);
  const [showFinanceSpecialization, setShowFinanceSpecialization] = useState(false);
  const [showHRSpecialization, setShowHRSpecialization] = useState(false);
  const [showLegalSpecialization, setShowLegalSpecialization] = useState(false);
  const [showManufacturingSpecialization, setShowManufacturingSpecialization] = useState(false);
  const [showEnergySpecialization, setShowEnergySpecialization] = useState(false);
  const [showPharmaSpecialization, setShowPharmaSpecialization] = useState(false);
  const [showPharmaRnDRoles, setShowPharmaRnDRoles] = useState(false);
  const [showClinicalTrialsRoles, setShowClinicalTrialsRoles] = useState(false);
  const [showPharmaManufacturingRoles, setShowPharmaManufacturingRoles] = useState(false);
  const [showQualityAssuranceRoles, setShowQualityAssuranceRoles] = useState(false);
  const [showRegulatoryAffairsRoles, setShowRegulatoryAffairsRoles] = useState(false);
  const [showPharmaSalesRoles, setShowPharmaSalesRoles] = useState(false);
  const [showMedicalWritingRoles, setShowMedicalWritingRoles] = useState(false);
  const [showPharmaSupplyChainRoles, setShowPharmaSupplyChainRoles] = useState(false);
  const [showPharmacovigilanceRoles, setShowPharmacovigilanceRoles] = useState(false);
  const [showSpecializedPharmaRoles, setShowSpecializedPharmaRoles] = useState(false);

  const handlePharmaSpecializationChange = (value: string) => {
    setShowPharmaRnDRoles(value === "Research and Development (R&D)");
    setShowClinicalTrialsRoles(value === "Clinical Trials and Medical Affairs");
    setShowPharmaManufacturingRoles(value === "Manufacturing and Production");
    setShowQualityAssuranceRoles(value === "Quality Assurance and Quality Control (QA/QC)");
    setShowRegulatoryAffairsRoles(value === "Regulatory Affairs");
    setShowPharmaSalesRoles(value === "Sales and Marketing");
    setShowMedicalWritingRoles(value === "Medical Writing and Communication");
    setShowPharmaSupplyChainRoles(value === "Supply Chain and Logistics");
    setShowPharmacovigilanceRoles(value === "Pharmacovigilance and Drug Safety");
    setShowSpecializedPharmaRoles(value === "Specialized Pharma Roles");
  };

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="workArea"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Current Area of Work</FormLabel>
            <FormControl>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  setShowOtherInput(value === "Other");
                  setShowITSpecialization(value === "IT");
                  setShowCustomerServiceSpecialization(value === "Customer Service");
                  setShowFinanceSpecialization(value === "Accounting & Finance");
                  setShowHRSpecialization(value === "Human Resources");
                  setShowLegalSpecialization(value === "Legal");
                  setShowManufacturingSpecialization(value === "Manufacturing");
                  setShowEnergySpecialization(value === "Energy & Utilities");
                  setShowPharmaSpecialization(value === "Pharma");
                }} 
                defaultValue={field.value}
              >
                <SelectTrigger className="w-full bg-white border border-gray-300">
                  <SelectValue placeholder="Select your current area of work" />
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
          onSpecializationChange={() => {}}
        />
      )}

      {showCustomerServiceSpecialization && (
        <CustomerServiceSpecializationSelect 
          control={control}
          onSpecializationChange={() => {}}
        />
      )}

      {showFinanceSpecialization && (
        <FinanceSpecializationSelect
          control={control}
          onSpecializationChange={() => {}}
        />
      )}

      {showHRSpecialization && (
        <HRSpecializationSelect
          control={control}
          onSpecializationChange={() => {}}
        />
      )}

      {showLegalSpecialization && (
        <LegalSpecializationSelect
          control={control}
          onSpecializationChange={() => {}}
        />
      )}

      {showManufacturingSpecialization && (
        <ManufacturingSpecializationSelect
          control={control}
          onSpecializationChange={() => {}}
        />
      )}

      {showEnergySpecialization && (
        <EnergySpecializationSelect 
          control={control}
          onSpecializationChange={() => {}}
        />
      )}

      {showPharmaSpecialization && (
        <PharmaSpecializationSelect 
          control={control}
          onSpecializationChange={handlePharmaSpecializationChange}
        />
      )}

      {showPharmaRnDRoles && (
        <JobTitleSelect control={control} titles={pharmaRnDRoles} />
      )}

      {showClinicalTrialsRoles && (
        <JobTitleSelect control={control} titles={clinicalTrialsRoles} />
      )}

      {showPharmaManufacturingRoles && (
        <JobTitleSelect control={control} titles={pharmaManufacturingRoles} />
      )}

      {showQualityAssuranceRoles && (
        <JobTitleSelect control={control} titles={qualityAssuranceRoles} />
      )}

      {showRegulatoryAffairsRoles && (
        <JobTitleSelect control={control} titles={regulatoryAffairsRoles} />
      )}

      {showPharmaSalesRoles && (
        <JobTitleSelect control={control} titles={pharmaSalesRoles} />
      )}

      {showMedicalWritingRoles && (
        <JobTitleSelect control={control} titles={medicalWritingRoles} />
      )}

      {showPharmaSupplyChainRoles && (
        <JobTitleSelect control={control} titles={pharmaSupplyChainRoles} />
      )}

      {showPharmacovigilanceRoles && (
        <JobTitleSelect control={control} titles={pharmacovigilanceRoles} />
      )}

      {showSpecializedPharmaRoles && (
        <JobTitleSelect control={control} titles={specializedPharmaRoles} />
      )}

      {showOtherInput && (
        <OtherWorkAreaInput control={control} />
      )}
    </div>
  );
};

export default WorkAreaField;
