import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import SalaryRangeField from "./SalaryRangeField";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";

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
  const [showOtherBenefits, setShowOtherBenefits] = useState(false);
  const [workLocation, setWorkLocation] = useState("office");

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
          name="workLocation"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Is this role office based?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => {
                    field.onChange(value);
                    setWorkLocation(value);
                  }}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="office" />
                    </FormControl>
                    <FormLabel className="font-normal">Yes</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="hybrid" />
                    </FormControl>
                    <FormLabel className="font-normal">Hybrid</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="remote" />
                    </FormControl>
                    <FormLabel className="font-normal">Remote</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {workLocation === "hybrid" && (
          <FormField
            control={control}
            name="officePercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What percentage of the role is office/remote?</FormLabel>
                <FormControl>
                  <div className="space-y-3">
                    <Slider
                      defaultValue={[50]}
                      max={100}
                      step={10}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{100 - (field.value || 50)}% Remote</span>
                      <span>{field.value || 50}% Office</span>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={control}
          name="holidayEntitlement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Holiday Entitlement (days)</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="bg-white border border-gray-300">
                    <SelectValue placeholder="Select holiday entitlement" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
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
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  setShowOtherBenefits(value === "Other");
                }} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="bg-white border border-gray-300">
                    <SelectValue placeholder="Select company benefits" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
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

        {showOtherBenefits && (
          <FormField
            control={control}
            name="otherBenefits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Please specify the benefits</FormLabel>
                <FormControl>
                  <Input placeholder="Enter the benefits..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </>
  );
};

export default JobDetailsFields;