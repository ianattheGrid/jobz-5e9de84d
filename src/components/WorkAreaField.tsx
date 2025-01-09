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
import JobTitleSelect from "./work-area/JobTitleSelect";
import OtherWorkAreaInput from "./work-area/OtherWorkAreaInput";
import { useState } from "react";
import {
  energyGenerationRoles,
  transmissionRoles,
  utilitiesManagementRoles,
  renewableEnergyRoles,
  engineeringTechnicalRoles,
  regulatoryRoles,
  customerServiceRoles,
  researchDevelopmentRoles,
  financeBusinessRoles,
  specializedEnergyRoles
} from "./work-area/constants/energy-roles";

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
  const [showEnergyGenerationRoles, setShowEnergyGenerationRoles] = useState(false);
  const [showTransmissionRoles, setShowTransmissionRoles] = useState(false);
  const [showUtilitiesManagementRoles, setShowUtilitiesManagementRoles] = useState(false);
  const [showRenewableEnergyRoles, setShowRenewableEnergyRoles] = useState(false);
  const [showEngineeringTechnicalRoles, setShowEngineeringTechnicalRoles] = useState(false);
  const [showRegulatoryRoles, setShowRegulatoryRoles] = useState(false);
  const [showCustomerServiceRoles, setShowCustomerServiceRoles] = useState(false);
  const [showResearchDevelopmentRoles, setShowResearchDevelopmentRoles] = useState(false);
  const [showFinanceBusinessRoles, setShowFinanceBusinessRoles] = useState(false);
  const [showSpecializedEnergyRoles, setShowSpecializedEnergyRoles] = useState(false);

  const handleEnergySpecializationChange = (value: string) => {
    setShowEnergyGenerationRoles(value === "Energy Generation and Production");
    setShowTransmissionRoles(value === "Transmission and Distribution");
    setShowUtilitiesManagementRoles(value === "Utilities Management and Operations");
    setShowRenewableEnergyRoles(value === "Renewable Energy and Sustainability");
    setShowEngineeringTechnicalRoles(value === "Engineering and Technical");
    setShowRegulatoryRoles(value === "Regulatory and Compliance");
    setShowCustomerServiceRoles(value === "Customer Service and Support");
    setShowResearchDevelopmentRoles(value === "Research and Development (R&D)");
    setShowFinanceBusinessRoles(value === "Finance and Business");
    setShowSpecializedEnergyRoles(value === "Specialized Energy Roles");
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
          onSpecializationChange={handleEnergySpecializationChange}
        />
      )}

      {showEnergyGenerationRoles && (
        <JobTitleSelect control={control} titles={energyGenerationRoles} />
      )}

      {showTransmissionRoles && (
        <JobTitleSelect control={control} titles={transmissionRoles} />
      )}

      {showUtilitiesManagementRoles && (
        <JobTitleSelect control={control} titles={utilitiesManagementRoles} />
      )}

      {showRenewableEnergyRoles && (
        <JobTitleSelect control={control} titles={renewableEnergyRoles} />
      )}

      {showEngineeringTechnicalRoles && (
        <JobTitleSelect control={control} titles={engineeringTechnicalRoles} />
      )}

      {showRegulatoryRoles && (
        <JobTitleSelect control={control} titles={regulatoryRoles} />
      )}

      {showCustomerServiceRoles && (
        <JobTitleSelect control={control} titles={customerServiceRoles} />
      )}

      {showResearchDevelopmentRoles && (
        <JobTitleSelect control={control} titles={researchDevelopmentRoles} />
      )}

      {showFinanceBusinessRoles && (
        <JobTitleSelect control={control} titles={financeBusinessRoles} />
      )}

      {showSpecializedEnergyRoles && (
        <JobTitleSelect control={control} titles={specializedEnergyRoles} />
      )}

      {showOtherInput && (
        <OtherWorkAreaInput control={control} />
      )}
    </div>
  );
};

export default WorkAreaField;
