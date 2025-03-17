
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";
import { CandidateFormValues } from "../candidateFormSchema";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getSkillsByWorkArea } from "@/components/work-area/skills";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useEffect } from "react";

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
  const workArea = control._formValues.workArea || '';
  const availableSkills = getSkillsByWorkArea(workArea);
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
      {/* Technical Skills Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Technical Skills</h3>
        <FormField
          control={control}
          name="required_skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What technical skills do you have?</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    const currentSkills = field.value || [];
                    if (!currentSkills.includes(value)) {
                      field.onChange([...currentSkills, value]);
                    }
                  }}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Choose from available skills" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {availableSkills.map((skill) => (
                      <SelectItem key={skill} value={skill}>
                        {skill}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <div className="flex flex-wrap gap-2 mt-2">
                {field.value?.map((skill) => (
                  <div key={skill} className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {skill}
                    <button
                      type="button"
                      onClick={() => {
                        field.onChange(field.value?.filter((s) => s !== skill));
                      }}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

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
                  className="min-h-[100px] bg-white resize-none"
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
                // Proper way to reset the field value using FormField
                const securityClearanceField = control._formState.defaultValues?.security_clearance_level;
                control._subjects.state.next({
                  name: "security_clearance_level",
                  type: "change",
                  value: undefined
                });
              }
            }}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes-option" />
              <FormLabel htmlFor="yes-option" className="font-normal">Yes</FormLabel>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no-option" />
              <FormLabel htmlFor="no-option" className="font-normal">No</FormLabel>
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select clearance level" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {SecurityClearanceLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default SkillsSection;
