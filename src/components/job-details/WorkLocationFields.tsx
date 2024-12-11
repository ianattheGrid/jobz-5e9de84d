import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Control } from "react-hook-form";
import { useState } from "react";

interface WorkLocationFieldsProps {
  control: Control<any>;
}

const WorkLocationFields = ({ control }: WorkLocationFieldsProps) => {
  const [workLocation, setWorkLocation] = useState("office");

  return (
    <>
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
    </>
  );
};

export default WorkLocationFields;