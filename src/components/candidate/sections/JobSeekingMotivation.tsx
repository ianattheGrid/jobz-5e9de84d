import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";
import { CandidateFormValues } from "../candidateFormSchema";

const JOB_SEEKING_REASONS = [
  "Seeking a new challenge",
  "Looking for a job closer to home",
  "Change of job role",
  "Prefer to work remotely",
  "Prefer to work in an office",
  "Currently not working",
  "Current company is having challenges",
  "Better work-life balance",
  "Higher salary or better benefits",
  "Career progression",
  "Relocation",
  "Contract ending",
  "Company culture"
] as const;

interface JobSeekingMotivationProps {
  control: Control<CandidateFormValues>;
}

const JobSeekingMotivation = ({ control }: JobSeekingMotivationProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Why Are You Looking for a New Job Role?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Employers value understanding your motivation for seeking a new opportunity. Please select one or more reasons from the list below that best describe your situation.
        </p>
      </div>

      <FormField
        control={control}
        name="job_seeking_reasons"
        render={({ field }) => (
          <FormItem>
            <div className="space-y-3">
              {JOB_SEEKING_REASONS.map((reason) => (
                <div key={reason} className="flex items-center space-x-2">
                  <Checkbox
                    checked={field.value?.includes(reason)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        field.onChange([...(field.value || []), reason]);
                      } else {
                        field.onChange(
                          field.value?.filter((value) => value !== reason) || []
                        );
                      }
                    }}
                  />
                  <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {reason}
                  </label>
                </div>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="other_job_seeking_reason"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Details (Optional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Tell us more about why you're looking for a new opportunity..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default JobSeekingMotivation;