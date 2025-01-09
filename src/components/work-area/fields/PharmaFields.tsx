import { Control } from "react-hook-form";
import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import JobTitleSelect from "../JobTitleSelect";
import { pharmaSpecializations } from "../constants/pharma";
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
} from "../constants/pharma";

interface PharmaFieldsProps {
  control: Control<any>;
  visible: boolean;
}

const PharmaFields = ({ control, visible }: PharmaFieldsProps) => {
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

  if (!visible) return null;

  const handleSpecializationChange = (value: string) => {
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
        name="pharmaSpecialization"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pharma Specialization</FormLabel>
            <FormControl>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  handleSpecializationChange(value);
                }}
                defaultValue={field.value}
              >
                <SelectTrigger className="w-full bg-white border border-gray-300">
                  <SelectValue placeholder="Select your pharma specialization" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {pharmaSpecializations.map((specialization) => (
                    <SelectItem key={specialization} value={specialization}>
                      {specialization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

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
    </div>
  );
};

export default PharmaFields;