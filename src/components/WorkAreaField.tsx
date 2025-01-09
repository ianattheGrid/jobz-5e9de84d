import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { workAreas } from "./work-area/constants";
import ITSpecializationSelect from "./work-area/specializations/ITSpecializationSelect";
import CustomerServiceSpecializationSelect from "./work-area/specializations/CustomerServiceSpecializationSelect";
import FinanceSpecializationSelect from "./work-area/specializations/FinanceSpecializationSelect";
import PharmaFields from "./work-area/fields/PharmaFields";
import OtherFields from "./work-area/fields/OtherFields";

interface WorkAreaFieldProps {
  control: Control<any>;
}

const WorkAreaField = ({ control }: WorkAreaFieldProps) => {
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [showITSpecialization, setShowITSpecialization] = useState(false);
  const [showCustomerServiceSpecialization, setShowCustomerServiceSpecialization] = useState(false);
  const [showFinanceSpecialization, setShowFinanceSpecialization] = useState(false);
  const [showPharmaFields, setShowPharmaFields] = useState(false);

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
                  setShowPharmaFields(value === "Pharma");
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

      <PharmaFields control={control} visible={showPharmaFields} />
      <OtherFields control={control} visible={showOtherInput} />
    </div>
  );
};

export default WorkAreaField;