
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const salaryOptions = [
  { value: "15000", label: "£15,000" },
  { value: "20000", label: "£20,000" },
  { value: "25000", label: "£25,000" },
  { value: "30000", label: "£30,000" },
  { value: "35000", label: "£35,000" },
  { value: "40000", label: "£40,000" },
  { value: "45000", label: "£45,000" },
  { value: "50000", label: "£50,000" },
  { value: "55000", label: "£55,000" },
  { value: "60000", label: "£60,000" },
  { value: "65000", label: "£65,000" },
  { value: "70000", label: "£70,000" },
  { value: "75000", label: "£75,000" },
  { value: "80000", label: "£80,000" },
  { value: "85000", label: "£85,000" },
  { value: "90000", label: "£90,000" },
  { value: "95000", label: "£95,000" },
  { value: "100000", label: "£100,000" },
  { value: "125000", label: "£125,000" },
  { value: "150000", label: "£150,000" },
  { value: "175000", label: "£175,000" },
  { value: "200000", label: "£200,000" },
  { value: "225000", label: "£225,000" },
  { value: "250000", label: "£250,000" },
];

interface SalaryRangeFieldProps {
  control: Control<any>;
}

const SalaryRangeField = ({ control }: SalaryRangeFieldProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="min_salary"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Minimum Salary (required)</FormLabel>
            <FormControl>
              <Select
                value={field.value?.toString()}
                onValueChange={(value) => field.onChange(parseInt(value))}
              >
                <SelectTrigger className="form-select-trigger bg-white">
                  <SelectValue placeholder="Select minimum salary" />
                </SelectTrigger>
                <SelectContent className="form-select-content select-dropdown max-h-[300px]">
                  {salaryOptions.map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      className="text-foreground hover:bg-muted"
                    >
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

      <FormField
        control={control}
        name="max_salary"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Maximum Salary (required)</FormLabel>
            <FormControl>
              <Select
                value={field.value?.toString()}
                onValueChange={(value) => field.onChange(parseInt(value))}
              >
                <SelectTrigger className="form-select-trigger bg-white">
                  <SelectValue placeholder="Select maximum salary" />
                </SelectTrigger>
                <SelectContent className="form-select-content select-dropdown max-h-[300px]">
                  {salaryOptions.map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      className="text-foreground hover:bg-muted"
                    >
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
    </div>
  );
};

export default SalaryRangeField;
