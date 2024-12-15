import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { CandidateFormValues } from "../../candidateFormSchema";

interface MinimumBonusSelectProps {
  control: Control<CandidateFormValues>;
}

const MinimumBonusSelect = ({ control }: MinimumBonusSelectProps) => {
  const bonusOptions = [
    { value: "flexible", label: "Flexible - consider all bonus rates" },
    ...Array.from({ length: 24 }, (_, i) => ({
      value: (2.5 + i * 0.5).toString(),
      label: `${(2.5 + i * 0.5).toFixed(1)}%`
    }))
  ];

  return (
    <FormField
      control={control}
      name="commission_percentage"
      render={({ field }) => (
        <FormItem>
          <FormLabel>What is the minimum bonus percentage you would consider?</FormLabel>
          <FormControl>
            <Select
              value={field.value?.toString() || "flexible"}
              onValueChange={(value) => {
                if (value === "flexible") {
                  field.onChange(null);
                } else {
                  field.onChange(parseFloat(value));
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select minimum bonus percentage" />
              </SelectTrigger>
              <SelectContent>
                {bonusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
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

export default MinimumBonusSelect;