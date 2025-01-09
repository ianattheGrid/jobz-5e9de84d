import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";

interface PharmaSpecializationSelectProps {
  control: Control<any>;
  onSpecializationChange: (value: string) => void;
}

const PharmaSpecializationSelect = ({ control, onSpecializationChange }: PharmaSpecializationSelectProps) => {
  const specializations = [
    "Research and Development (R&D)",
    "Clinical Trials and Medical Affairs",
    "Manufacturing and Production",
    "Quality Assurance and Quality Control (QA/QC)",
    "Regulatory Affairs",
    "Sales and Marketing",
    "Medical Writing and Communication",
    "Supply Chain and Logistics",
    "Pharmacovigilance and Drug Safety",
    "Specialized Pharma Roles"
  ];

  return (
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
                onSpecializationChange(value);
              }}
              defaultValue={field.value}
            >
              <SelectTrigger className="w-full bg-white border border-gray-300">
                <SelectValue placeholder="Select your specialization" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {specializations.map((specialization) => (
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
  );
};

export default PharmaSpecializationSelect;