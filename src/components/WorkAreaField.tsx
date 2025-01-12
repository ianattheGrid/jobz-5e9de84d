import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { workAreas } from "./work-area/constants";
import { itRoles } from "./work-area/constants/it-roles";
import { 
  customerSupportTitles,
  customerExperienceTitles,
  customerServiceManagementTitles,
  salesAndRetentionTitles,
  specializedCustomerServiceTitles,
  technicalSupportTitles
} from "./work-area/constants/customer-service-roles";
import { financeRoles } from "./work-area/constants/finance-roles";
import ITSpecializationSelect from "./work-area/specializations/ITSpecializationSelect";
import CustomerServiceSpecializationSelect from "./work-area/specializations/CustomerServiceSpecializationSelect";
import FinanceSpecializationSelect from "./work-area/specializations/FinanceSpecializationSelect";
import PublicSectorSpecializationSelect from "./work-area/specializations/PublicSectorSpecializationSelect";
import EngineeringSpecializationSelect from "./work-area/specializations/EngineeringSpecializationSelect";
import HospitalitySpecializationSelect from "./work-area/specializations/HospitalitySpecializationSelect";
import JobTitleSelect from "./work-area/JobTitleSelect";
import PharmaFields from "./work-area/fields/PharmaFields";
import OtherFields from "./work-area/fields/OtherFields";
import { useWorkAreaState } from "./work-area/useWorkAreaState";

interface WorkAreaFieldProps {
  control: Control<any>;
}

const WorkAreaField = ({ control }: WorkAreaFieldProps) => {
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [showITSpecialization, setShowITSpecialization] = useState(false);
  const [showCustomerServiceSpecialization, setShowCustomerServiceSpecialization] = useState(false);
  const [showFinanceSpecialization, setShowFinanceSpecialization] = useState(false);
  const [showPublicSectorSpecialization, setShowPublicSectorSpecialization] = useState(false);
  const [showEngineeringSpecialization, setShowEngineeringSpecialization] = useState(false);
  const [showHospitalitySpecialization, setShowHospitalitySpecialization] = useState(false);
  const [showPharmaFields, setShowPharmaFields] = useState(false);
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>("");
  const [availableTitles, setAvailableTitles] = useState<string[]>([]);

  const handleSpecializationChange = (specialization: string) => {
    setSelectedSpecialization(specialization);
    // Reset job title when specialization changes
    control._formValues.title = "";
    
    // Update available titles based on specialization
    // This will be handled by the individual specialization components
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
                  setShowPublicSectorSpecialization(value === "Public Sector");
                  setShowEngineeringSpecialization(value === "Engineering");
                  setShowHospitalitySpecialization(value === "Hospitality & Tourism");
                  setShowPharmaFields(value === "Pharma");
                  // Reset specialization and title when work area changes
                  setSelectedSpecialization("");
                  setAvailableTitles([]);
                  control._formValues.title = "";
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
          onSpecializationChange={(spec) => {
            handleSpecializationChange(spec);
            setAvailableTitles(getTitlesForITSpecialization(spec));
          }}
        />
      )}

      {showCustomerServiceSpecialization && (
        <CustomerServiceSpecializationSelect 
          control={control}
          onSpecializationChange={(spec) => {
            handleSpecializationChange(spec);
            setAvailableTitles(getTitlesForCustomerServiceSpecialization(spec));
          }}
        />
      )}

      {showFinanceSpecialization && (
        <FinanceSpecializationSelect
          control={control}
          onSpecializationChange={(spec) => {
            handleSpecializationChange(spec);
            setAvailableTitles(getTitlesForFinanceSpecialization(spec));
          }}
        />
      )}

      {showPublicSectorSpecialization && (
        <PublicSectorSpecializationSelect
          control={control}
          onSpecializationChange={(spec) => {
            handleSpecializationChange(spec);
            setAvailableTitles(getTitlesForPublicSectorSpecialization(spec));
          }}
        />
      )}

      {showEngineeringSpecialization && (
        <EngineeringSpecializationSelect
          control={control}
          onSpecializationChange={(spec) => {
            handleSpecializationChange(spec);
            setAvailableTitles(getTitlesForEngineeringSpecialization(spec));
          }}
        />
      )}

      {showHospitalitySpecialization && (
        <HospitalitySpecializationSelect
          control={control}
          onSpecializationChange={(spec) => {
            handleSpecializationChange(spec);
            setAvailableTitles(getTitlesForHospitalitySpecialization(spec));
          }}
        />
      )}

      {selectedSpecialization && availableTitles.length > 0 && (
        <JobTitleSelect
          control={control}
          titles={availableTitles}
        />
      )}

      <PharmaFields control={control} visible={showPharmaFields} />
      <OtherFields control={control} visible={showOtherInput} />
    </div>
  );
};

// Helper functions to get titles based on specialization
const getTitlesForITSpecialization = (specialization: string): string[] => {
  const {
    softwareDevTitles,
    itSupportTitles,
    networkingTitles,
    cybersecurityTitles,
    dataAnalyticsTitles,
    cloudComputingTitles,
    aiTitles,
    testingTitles,
    itManagementTitles,
    specializedITTitles
  } = itRoles;

  switch (specialization) {
    case "Software Development and Programming":
      return softwareDevTitles;
    case "IT Support and Operations":
      return itSupportTitles;
    case "Networking and Infrastructure":
      return networkingTitles;
    case "Cybersecurity":
      return cybersecurityTitles;
    case "Data and Analytics":
      return dataAnalyticsTitles;
    case "Cloud Computing":
      return cloudComputingTitles;
    case "Artificial Intelligence and Machine Learning":
      return aiTitles;
    case "Testing and Quality Assurance":
      return testingTitles;
    case "IT Management":
      return itManagementTitles;
    case "Specialised IT Roles":
      return specializedITTitles;
    default:
      return [];
  }
};

const getTitlesForCustomerServiceSpecialization = (specialization: string): string[] => {
  switch (specialization) {
    case "Customer Support Roles":
      return customerSupportTitles;
    case "Customer Experience Roles":
      return customerExperienceTitles;
    case "Management Roles":
      return customerServiceManagementTitles;
    case "Sales and Retention Roles":
      return salesAndRetentionTitles;
    case "Specialised Customer Service Roles":
      return specializedCustomerServiceTitles;
    case "Technical and Advanced Support Roles":
      return technicalSupportTitles;
    default:
      return [];
  }
};

const getTitlesForFinanceSpecialization = (specialization: string): string[] => {
  const {
    accountingRoles,
    financialAnalysisRoles,
    auditingRoles,
    bankingRoles,
    taxAndTreasuryRoles,
    financeOperationsRoles,
    specializedFinanceRoles
  } = financeRoles;

  switch (specialization) {
    case "Accounting Roles":
      return accountingRoles;
    case "Financial Analysis and Planning Roles":
      return financialAnalysisRoles;
    case "Auditing and Compliance Roles":
      return auditingRoles;
    case "Banking and Investment Roles":
      return bankingRoles;
    case "Tax and Treasury Roles":
      return taxAndTreasuryRoles;
    case "Finance Operations Roles":
      return financeOperationsRoles;
    case "Specialized Accounting and Finance Roles":
      return specializedFinanceRoles;
    default:
      return [];
  }
};

const getTitlesForPublicSectorSpecialization = (specialization: string): string[] => {
  // Import and use public sector titles from constants
  return []; // Implement based on public sector roles
};

const getTitlesForEngineeringSpecialization = (specialization: string): string[] => {
  // Import and use engineering titles from constants
  return []; // Implement based on engineering roles
};

const getTitlesForHospitalitySpecialization = (specialization: string): string[] => {
  // Import and use hospitality titles from constants
  return []; // Implement based on hospitality roles
};

export default WorkAreaField;