
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";
import { CandidateFormValues } from "../candidateFormSchema";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getSkillsByWorkArea } from "@/components/work-area/skills";

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

  return (
    <div className="space-y-8 bg-white rounded-lg p-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Technical Skills</h3>
        
        {availableSkills.length > 0 && (
          <FormField
            control={control}
            name="required_skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skills in your area</FormLabel>
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
                      <SelectValue placeholder="Select skills relevant to your role" />
                    </SelectTrigger>
                    <SelectContent>
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
        )}
      </div>

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
                  placeholder="Enter your qualifications (separate with commas)"
                  className="min-h-[100px] bg-white"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Clearance</h3>
        <FormField
          control={control}
          name="security_clearance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Do you have security clearance?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="security-yes" />
                    <label htmlFor="security-yes">Yes</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="security-no" />
                    <label htmlFor="security-no">No</label>
                  </div>
                </RadioGroup>
              </FormControl>
              {field.value === 'yes' && (
                <FormField
                  control={control}
                  name="security_clearance_level"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>What level of security clearance do you have?</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select clearance level" />
                        </SelectTrigger>
                        <SelectContent>
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
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default SkillsSection;
