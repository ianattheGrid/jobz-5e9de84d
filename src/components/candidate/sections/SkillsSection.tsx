import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { CandidateFormValues } from "../candidateFormSchema";
import ITSkillsField from "@/components/job-details/ITSkillsField";

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
            <FormLabel>Additional Skills or Certifications</FormLabel>
            <FormControl>
              <Input {...field} placeholder="e.g., AWS Certified, Scrum Master, etc." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default SkillsSection;