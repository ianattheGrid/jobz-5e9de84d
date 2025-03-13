
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
    <div className="space-y-6 bg-white rounded-lg p-6">
      <ITSkillsField control={control} />
      <QualificationField control={control} />
    </div>
  );
};

export default SkillsSection;
