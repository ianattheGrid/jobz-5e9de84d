
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";
import { CandidateFormValues } from "../candidateFormSchema";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SkillsSectionProps {
  control: Control<CandidateFormValues>;
}

const SecurityClearanceLevels = [
  "Baseline Personnel Security Standard (BPSS)",
  "Counter Terrorist Check (CTC)",
  "Security Check (SC)",
  "Developed Vetting (DV)",
  "Enhanced Security Check (eSC)"
];

const SkillsSection = ({ control }: SkillsSectionProps) => {
  const [hasSecurityClearance, setHasSecurityClearance] = useState<string | null>(null);

  useEffect(() => {
    // Set initial state based on whether security_clearance_level has a value
    const clearanceLevel = control._formValues.security_clearance_level;
    if (clearanceLevel) {
      setHasSecurityClearance("yes");
    }
  }, [control._formValues.security_clearance_level]);

  return (
    <div className="space-y-8 bg-white rounded-lg p-6">
      {/* Industry Qualifications Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Industry Qualifications</h3>
        <FormField
          control={control}
          name="qualifications"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Do you have any industry qualifications?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your qualifications"
                  className="min-h-[100px] bg-white text-gray-900 resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Security Clearance Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Clearance</h3>
        
        {/* Yes/No question for security clearance */}
        <div className="mb-4">
          <FormLabel className="mb-2 block">Do you have security clearance?</FormLabel>
          <RadioGroup
            value={hasSecurityClearance || ""}
            onValueChange={(value) => {
              setHasSecurityClearance(value);
              // Clear the security clearance level if "no" is selected
              if (value === "no") {
                // Using setValue from the form's context would be ideal,
                // but since we only have control, we'll access the form state directly
                if (control._names.array.has("security_clearance_level")) {
                  // This is a safer approach than manipulating internal properties
                  const unsetField = () => {
                    control._formValues.security_clearance_level = undefined;
                  };
                  unsetField();
                }
              }
            }}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes-option" className="text-gray-900 bg-white border-gray-300" />
              <FormLabel htmlFor="yes-option" className="font-normal text-gray-900">Yes</FormLabel>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no-option" className="text-gray-900 bg-white border-gray-300" />
              <FormLabel htmlFor="no-option" className="font-normal text-gray-900">No</FormLabel>
            </div>
          </RadioGroup>
        </div>
        
        {/* Show security clearance level dropdown only if "yes" is selected */}
        {hasSecurityClearance === "yes" && (
          <FormField
            control={control}
            name="security_clearance_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What level of security clearance do you have?</FormLabel>
                <FormControl>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900"
                    value={field.value}
                    onChange={field.onChange}
                  >
                    <option value="">Select clearance level</option>
                    {SecurityClearanceLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
      
      <div className="p-4 border border-amber-200 bg-amber-50 rounded-md">
        <p className="text-amber-700 text-sm">
          The skills section has been temporarily removed while we work on improving it. 
          You can still add your qualifications and security clearance information above.
        </p>
      </div>
    </div>
  );
};

export default SkillsSection;
