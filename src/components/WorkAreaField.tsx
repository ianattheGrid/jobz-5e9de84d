import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { 
  workAreas, 
  itSpecializations,
  customerServiceSpecializations,
  customerSupportTitles,
  customerExperienceTitles,
  customerServiceManagementTitles
} from "./work-area/constants";
import ITSpecializationSelect from "./work-area/ITSpecializationSelect";
import CustomerServiceSpecializationSelect from "./work-area/CustomerServiceSpecializationSelect";
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
  const [showCustomerSupportTitles, setShowCustomerSupportTitles] = useState(false);
  const [showCustomerExperienceTitles, setShowCustomerExperienceTitles] = useState(false);
  const [showCustomerServiceManagementTitles, setShowCustomerServiceManagementTitles] = useState(false);

  const handleCustomerServiceSpecializationChange = (value: string) => {
    setShowCustomerSupportTitles(value === "Customer Support Roles");
    setShowCustomerExperienceTitles(value === "Customer Experience Roles");
    setShowCustomerServiceManagementTitles(value === "Management Roles");
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

      {showCustomerSupportTitles && (
        <JobTitleSelect control={control} titles={customerSupportTitles} />
      )}

      {showCustomerExperienceTitles && (
        <JobTitleSelect control={control} titles={customerExperienceTitles} />
      )}

      {showCustomerServiceManagementTitles && (
        <JobTitleSelect control={control} titles={customerServiceManagementTitles} />
      )}

      {showOtherInput && (
        <OtherWorkAreaInput control={control} />
      )}
    </div>
  );
};

export default WorkAreaField;