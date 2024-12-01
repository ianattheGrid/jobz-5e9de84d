import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import SalaryRangeField from "./SalaryRangeField";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface JobDetailsFieldsProps {
  control: Control<any>;
}

const HOLIDAY_ENTITLEMENTS = [
  "20-22",
  "23-25",
  "26-28",
  "29-31",
  "32-34",
  "34-36",
  "36-38",
  "38-40",
  "40+"
];

const COMPANY_BENEFITS = [
  "Pension",
  "Childcare",
  "Health",
  "Dental",
  "Gym",
  "Car",
  "Optical",
  "Wellness",
  "Counselling",
  "Travel",
  "Parking",
  "Insurance",
  "Food/Drink",
  "Share options",
  "Commission",
  "Bonuses",
  "Other"
];

const JobDetailsFields = ({ control }: JobDetailsFieldsProps) => {
  return (
    <>
      <div className="space-y-4">
        <SalaryRangeField control={control} />

        <FormField
          control={control}
          name="actualSalary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Actual salary</FormLabel>
              <FormControl>
                <Input placeholder="Enter the actual salary..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="holidayEntitlement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Holiday Entitlement (days)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select holiday entitlement" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {HOLIDAY_ENTITLEMENTS.map((days) => (
                    <SelectItem key={days} value={days}>
                      {days}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="companyBenefits"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Benefits</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company benefits" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {COMPANY_BENEFITS.map((benefit) => (
                    <SelectItem key={benefit} value={benefit}>
                      {benefit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default JobDetailsFields;