import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { 
  workAreas, 
  itSpecializations,
  customerServiceSpecializations,
  customerSupportTitles,
  customerExperienceTitles,
  customerServiceManagementTitles,
  salesAndRetentionTitles,
  specializedCustomerServiceTitles,
  technicalSupportTitles,
  accountingRoles,
  financialAnalysisRoles,
  auditingRoles,
  bankingRoles,
  taxAndTreasuryRoles,
  financeOperationsRoles,
  specializedFinanceRoles
} from "./work-area/constants";
import ITSpecializationSelect from "./work-area/ITSpecializationSelect";
import CustomerServiceSpecializationSelect from "./work-area/CustomerServiceSpecializationSelect";
import FinanceSpecializationSelect from "./work-area/FinanceSpecializationSelect";
import JobTitleSelect from "./work-area/JobTitleSelect";
import OtherWorkAreaInput from "./work-area/OtherWorkAreaInput";
import { useState } from "react";

interface WorkAreaFieldProps {
  control: Control<any>;
}

const WorkAreaField = ({ control }: WorkAreaFieldProps) => {
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [showITSpecialization, setShowITSpecialization] = useState(false);
  const [showCustomerServiceSpecialization, setShowCustomerServiceSpecialization] = useState(false);
  const [showFinanceSpecialization, setShowFinanceSpecialization] = useState(false);
  const [showCustomerSupportTitles, setShowCustomerSupportTitles] = useState(false);
  const [showCustomerExperienceTitles, setShowCustomerExperienceTitles] = useState(false);
  const [showCustomerServiceManagementTitles, setShowCustomerServiceManagementTitles] = useState(false);
  const [showSalesAndRetentionTitles, setShowSalesAndRetentionTitles] = useState(false);
  const [showSpecializedCustomerServiceTitles, setShowSpecializedCustomerServiceTitles] = useState(false);
  const [showTechnicalSupportTitles, setShowTechnicalSupportTitles] = useState(false);
  const [showAccountingRoles, setShowAccountingRoles] = useState(false);
  const [showFinancialAnalysisRoles, setShowFinancialAnalysisRoles] = useState(false);
  const [showAuditingRoles, setShowAuditingRoles] = useState(false);
  const [showBankingRoles, setShowBankingRoles] = useState(false);
  const [showTaxAndTreasuryRoles, setShowTaxAndTreasuryRoles] = useState(false);
  const [showFinanceOperationsRoles, setShowFinanceOperationsRoles] = useState(false);
  const [showSpecializedFinanceRoles, setShowSpecializedFinanceRoles] = useState(false);

  const handleCustomerServiceSpecializationChange = (value: string) => {
    setShowCustomerSupportTitles(value === "Customer Support Roles");
    setShowCustomerExperienceTitles(value === "Customer Experience Roles");
    setShowCustomerServiceManagementTitles(value === "Management Roles");
    setShowSalesAndRetentionTitles(value === "Sales and Retention Roles");
    setShowSpecializedCustomerServiceTitles(value === "Specialised Customer Service Roles");
    setShowTechnicalSupportTitles(value === "Technical and Advanced Support Roles");
  };

  const handleFinanceSpecializationChange = (value: string) => {
    setShowAccountingRoles(value === "Accounting Roles");
    setShowFinancialAnalysisRoles(value === "Financial Analysis and Planning Roles");
    setShowAuditingRoles(value === "Auditing and Compliance Roles");
    setShowBankingRoles(value === "Banking and Investment Roles");
    setShowTaxAndTreasuryRoles(value === "Tax and Treasury Roles");
    setShowFinanceOperationsRoles(value === "Finance Operations Roles");
    setShowSpecializedFinanceRoles(value === "Specialized Accounting and Finance Roles");
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
          onSpecializationChange={handleCustomerServiceSpecializationChange}
        />
      )}

      {showFinanceSpecialization && (
        <FinanceSpecializationSelect
          control={control}
          onSpecializationChange={handleFinanceSpecializationChange}
        />
      )}

      {showCustomerSupportTitles && (
        <JobTitleSelect control={control} titles={customerSupportTitles} />
      )}

      {showCustomerExperienceTitles && (
        <JobTitleSelect control={control} titles={customerExperienceTitles} />
      )}

      {showCustomerServiceManagementTitles && (
        <JobTitleSelect control={control} titles={customerServiceManagementTitles} />
      )}

      {showSalesAndRetentionTitles && (
        <JobTitleSelect control={control} titles={salesAndRetentionTitles} />
      )}

      {showSpecializedCustomerServiceTitles && (
        <JobTitleSelect control={control} titles={specializedCustomerServiceTitles} />
      )}

      {showTechnicalSupportTitles && (
        <JobTitleSelect control={control} titles={technicalSupportTitles} />
      )}

      {showAccountingRoles && (
        <JobTitleSelect control={control} titles={accountingRoles} />
      )}

      {showFinancialAnalysisRoles && (
        <JobTitleSelect control={control} titles={financialAnalysisRoles} />
      )}

      {showAuditingRoles && (
        <JobTitleSelect control={control} titles={auditingRoles} />
      )}

      {showBankingRoles && (
        <JobTitleSelect control={control} titles={bankingRoles} />
      )}

      {showTaxAndTreasuryRoles && (
        <JobTitleSelect control={control} titles={taxAndTreasuryRoles} />
      )}

      {showFinanceOperationsRoles && (
        <JobTitleSelect control={control} titles={financeOperationsRoles} />
      )}

      {showSpecializedFinanceRoles && (
        <JobTitleSelect control={control} titles={specializedFinanceRoles} />
      )}

      {showOtherInput && (
        <OtherWorkAreaInput control={control} />
      )}
    </div>
  );
};

export default WorkAreaField;