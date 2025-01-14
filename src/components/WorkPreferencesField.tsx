import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";

interface WorkPreferencesFieldProps {
  control: Control<any>;
}

const workPreferencesOptions = [
  "Flexible",
  "Home working",
  "Hybrid working",
  "Office based"
];

const WorkPreferencesField = ({ control }: WorkPreferencesFieldProps) => {
  return (
    <FormField
      control={control}
      name="work_preferences"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Your work preferences</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="w-full bg-card text-foreground border-border">
                <SelectValue placeholder="Select your work preferences" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                {workPreferencesOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
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

export default WorkPreferencesField;