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
import JobTitleSelect from "./work-area/JobTitleSelect";
import OtherWorkAreaInput from "./work-area/OtherWorkAreaInput";
import { useState } from "react";
import {
  productionRoles,
  maintenanceRoles,
  qualityAssuranceRoles,
  researchDevelopmentRoles,
  supplyChainRoles,
  hseRoles,
  automationRoles,
  managementRoles,
  specializedManufacturingRoles
} from "./work-area/constants/manufacturing-roles";

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
  const [showProductionRoles, setShowProductionRoles] = useState(false);
  const [showMaintenanceRoles, setShowMaintenanceRoles] = useState(false);
  const [showQualityAssuranceRoles, setShowQualityAssuranceRoles] = useState(false);
  const [showResearchDevelopmentRoles, setShowResearchDevelopmentRoles] = useState(false);
  const [showSupplyChainRoles, setShowSupplyChainRoles] = useState(false);
  const [showHSERoles, setShowHSERoles] = useState(false);
  const [showAutomationRoles, setShowAutomationRoles] = useState(false);
  const [showManagementRoles, setShowManagementRoles] = useState(false);
  const [showSpecializedManufacturingRoles, setShowSpecializedManufacturingRoles] = useState(false);

  const handleManufacturingSpecializationChange = (value: string) => {
    setShowProductionRoles(value === "Production and Operations");
    setShowMaintenanceRoles(value === "Maintenance and Technical Support");
    setShowQualityAssuranceRoles(value === "Quality Assurance and Compliance");
    setShowResearchDevelopmentRoles(value === "Research and Development (R&D)");
    setShowSupplyChainRoles(value === "Supply Chain and Logistics");
    setShowHSERoles(value === "Health, Safety, and Environmental (HSE)");
    setShowAutomationRoles(value === "Automation and Advanced Manufacturing");
    setShowManagementRoles(value === "Management and Leadership");
    setShowSpecializedManufacturingRoles(value === "Specialized Manufacturing");
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
          onSpecializationChange={handleManufacturingSpecializationChange}
        />
      )}

      {showProductionRoles && (
        <JobTitleSelect control={control} titles={productionRoles} />
      )}

      {showMaintenanceRoles && (
        <JobTitleSelect control={control} titles={maintenanceRoles} />
      )}

      {showQualityAssuranceRoles && (
        <JobTitleSelect control={control} titles={qualityAssuranceRoles} />
      )}

      {showResearchDevelopmentRoles && (
        <JobTitleSelect control={control} titles={researchDevelopmentRoles} />
      )}

      {showSupplyChainRoles && (
        <JobTitleSelect control={control} titles={supplyChainRoles} />
      )}

      {showHSERoles && (
        <JobTitleSelect control={control} titles={hseRoles} />
      )}

      {showAutomationRoles && (
        <JobTitleSelect control={control} titles={automationRoles} />
      )}

      {showManagementRoles && (
        <JobTitleSelect control={control} titles={managementRoles} />
      )}

      {showSpecializedManufacturingRoles && (
        <JobTitleSelect control={control} titles={specializedManufacturingRoles} />
      )}

      {showOtherInput && (
        <OtherWorkAreaInput control={control} />
      )}
    </div>
  );
};

export default WorkAreaField;
