import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";
import { CandidateFormValues } from "../candidateFormSchema";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface WorkPreferencesProps {
  control: Control<CandidateFormValues>;
}

const workTypeOptions = [
  { id: "flexible", label: "Flexible" },
  { id: "office", label: "Office based" },
  { id: "hybrid", label: "Hybrid" },
  { id: "remote", label: "Working from home" }
];

const WorkPreferences = ({ control }: WorkPreferencesProps) => {
  return (
    <FormField
      control={control}
      name="preferred_work_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm">Preferred Work Type</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={(value) => field.onChange([value])}
              value={field.value?.[0]}
              className="grid gap-4"
            >
              {workTypeOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-3">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <FormLabel htmlFor={option.id} className="text-sm font-normal">
                    {option.label}
                  </FormLabel>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          <div className="text-sm text-gray-600 mt-1">
            Select your preferred work arrangement
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default WorkPreferences;