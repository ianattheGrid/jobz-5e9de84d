import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Control } from "react-hook-form";

const SIGNUP_PERIODS = [
  { value: "24h", label: "Last 24 hours" },
  { value: "48h", label: "Last 48 hours" },
  { value: "1w", label: "Last week" },
  { value: "2w", label: "Last 2 weeks" },
  { value: "4w", label: "Last 4 weeks" },
  { value: "3m", label: "Last 3 months" },
  { value: "6m+", label: "6+ months" },
] as const;

interface SignupPeriodFieldProps {
  control: Control<any>;
}

export default function SignupPeriodField({ control }: SignupPeriodFieldProps) {
  return (
    <FormField
      control={control}
      name="signupPeriod"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Candidate sign up date</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} value={field.value || "all"}>
              <SelectTrigger className="bg-white border border-gray-300">
                <SelectValue placeholder="Any time" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300 z-50">
                <SelectItem value="all">Any time</SelectItem>
                {SIGNUP_PERIODS.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
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
}