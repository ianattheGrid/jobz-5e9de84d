import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";
import { CandidateFormValues } from "../candidateFormSchema";
import ITSkillsField from "@/components/job-details/ITSkillsField";
import QualificationSelector from "@/components/job-details/QualificationSelector";

interface SkillsSectionProps {
  control: Control<CandidateFormValues>;
}

const SkillsSection = ({ control }: SkillsSectionProps) => {
  return (
    <>
      <ITSkillsField control={control} />
      
      <FormField
        control={control}
        name="additional_skills"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Your Certifications</FormLabel>
            <FormControl>
              <QualificationSelector
                selectedQualification={field.value || "None"}
                onSelect={(value) => field.onChange(value === "None" ? "" : value)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default SkillsSection;