import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { useState } from "react";

interface ApplicationPreferencesFieldProps {
  control: Control<any>;
}

const ApplicationPreferencesField = ({ control }: ApplicationPreferencesFieldProps) => {
  const [method, setMethod] = useState("platform");

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="applicationMethod"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>How would you like to receive applications?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={(value) => {
                  field.onChange(value);
                  setMethod(value);
                }}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="platform" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Through our platform (recommended - keeps your email private)
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="email" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Direct to my email address
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="custom" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Custom application instructions
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {method === "email" && (
        <FormField
          control={control}
          name="applicationEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address for applications</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email address..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {method === "custom" && (
        <FormField
          control={control}
          name="applicationInstructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Application Instructions</FormLabel>
              <FormControl>
                <Input 
                  placeholder="E.g., Apply through our careers page at..." 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default ApplicationPreferencesField;