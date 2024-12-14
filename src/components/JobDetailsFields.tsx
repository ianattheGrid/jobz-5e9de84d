import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Control, useWatch } from "react-hook-form";
import SalaryFields from "./job-details/SalaryFields";
import WorkLocationFields from "./job-details/WorkLocationFields";
import BenefitsFields from "./job-details/BenefitsFields";
import { Textarea } from "@/components/ui/textarea";
import ITQualificationsField from "./job-details/ITQualificationsField";

interface JobDetailsFieldsProps {
  control: Control<any>;
}

const JobDetailsFields = ({ control }: JobDetailsFieldsProps) => {
  const description = useWatch({
    control,
    name: "description",
    defaultValue: "",
  });

  const qualifications = useWatch({
    control,
    name: "required_qualifications",
    defaultValue: [],
  });

  const characterCount = description?.length || 0;
  const maxCharacters = 2000;

  return (
    <div className="space-y-4">
      <SalaryFields control={control} />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Description</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                className="min-h-[150px]"
                placeholder="Enter a detailed job description..."
              />
            </FormControl>
            <div className="text-sm text-muted-foreground mt-1">
              {characterCount}/{maxCharacters} characters
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <ITQualificationsField 
        control={control}
        value={qualifications}
        onChange={(newValue) => control.setValue("required_qualifications", newValue)}
      />

      <WorkLocationFields control={control} />
      <BenefitsFields control={control} />
    </div>
  );
};

export default JobDetailsFields;