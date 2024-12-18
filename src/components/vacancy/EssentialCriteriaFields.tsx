import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EssentialCriteriaFieldsProps {
  control: Control<any>;
}

const EssentialCriteriaFields = ({ control }: EssentialCriteriaFieldsProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Essential Criteria</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Select which criteria are essential for candidates to meet
      </p>

      <FormField
        control={control}
        name="titleEssential"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Job Title</FormLabel>
              <FormDescription>
                Candidate must have exact job title match
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="yearsExperienceEssential"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Years Experience</FormLabel>
              <FormDescription>
                Candidate must meet minimum years of experience
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {control._formValues.yearsExperienceEssential && (
        <FormField
          control={control}
          name="minYearsExperience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Years Experience Required</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  {...field}
                  onChange={e => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
            </FormItem>
          )}
        />
      )}

      <FormField
        control={control}
        name="salaryEssential"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Salary Range</FormLabel>
              <FormDescription>
                Candidate's salary expectations must be within range
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="skillsEssential"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Required Skills</FormLabel>
              <FormDescription>
                Candidate must have all required skills
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="qualificationEssential"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Qualification</FormLabel>
              <FormDescription>
                Candidate must have required qualification
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="citizenshipEssential"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Citizenship/Work Eligibility</FormLabel>
              <FormDescription>
                Candidate must meet citizenship/work eligibility requirements
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {control._formValues.citizenshipEssential && (
        <FormField
          control={control}
          name="requiredCitizenship"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Required Citizenship/Work Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select required status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="UK citizens only">UK citizens only</SelectItem>
                  <SelectItem value="EU Settlement Scheme">EU Settlement Scheme</SelectItem>
                  <SelectItem value="Valid work visa">Valid work visa</SelectItem>
                  <SelectItem value="Any">Any</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default EssentialCriteriaFields;