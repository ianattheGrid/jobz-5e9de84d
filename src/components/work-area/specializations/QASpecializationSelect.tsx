
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { qaSpecializations } from "../constants/qa-roles";

interface QASpecializationSelectProps {
  control: Control<any>;
  onSpecializationChange: (value: string) => void;
}

const QASpecializationSelect = ({
  control,
  onSpecializationChange
}: QASpecializationSelectProps) => {
  return (
    <FormField
      control={control}
      name="specialization"
      render={({ field }) => (
        <FormItem>
          <FormLabel>QA Specialization</FormLabel>
          <FormControl>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                onSpecializationChange(value);
              }}
              defaultValue={field.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your QA specialization" />
              </SelectTrigger>
              <SelectContent>
                {qaSpecializations.map((specialization) => (
                  <SelectItem key={specialization} value={specialization}>
                    {specialization}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default QASpecializationSelect;
