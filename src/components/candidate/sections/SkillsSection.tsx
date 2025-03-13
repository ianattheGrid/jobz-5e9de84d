
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";
import { CandidateFormValues } from "../candidateFormSchema";
import ITSkillsField from "@/components/job-details/ITSkillsField";
import QualificationField from "@/components/shared/QualificationField";

interface SkillsSectionProps {
  control: Control<CandidateFormValues>;
}

const SkillsSection = ({ control }: SkillsSectionProps) => {
  return (
    <>
      <ITSkillsField control={control} />
      <QualificationField control={form.control} />
    </>
  );
};

export default SkillsSection;
