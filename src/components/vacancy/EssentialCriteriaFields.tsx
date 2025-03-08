
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
      <h3 className="text-lg font-semibold text-gray-900">Essential Criteria</h3>
      <p className="text-sm text-gray-600 mb-4">
        Select which criteria are essential for candidates to meet
      </p>

      <FormField
        control={control}
        name="titleEssential"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-white">
            <div className="space-y-0.5">
              <FormLabel className="text-base text-gray-900">Job Title</FormLabel>
              <FormDescription className="text-gray-600">
                Candidate must have exact job title match
              </FormDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{field.value ? 'Yes' : 'No'}</span>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-primary"
                />
              </FormControl>
            </div>
          </FormItem>
        )}
      />

      {/* Repeat the same pattern for other switches */}
      <FormField
        control={control}
        name="yearsExperienceEssential"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-white">
            <div className="space-y-0.5">
              <FormLabel className="text-base text-gray-900">Years Experience</FormLabel>
              <FormDescription className="text-gray-600">
                Candidate must meet minimum years of experience
              </FormDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{field.value ? 'Yes' : 'No'}</span>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-primary"
                />
              </FormControl>
            </div>
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
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-white">
            <div className="space-y-0.5">
              <FormLabel className="text-base text-gray-900">Salary Range</FormLabel>
              <FormDescription className="text-gray-600">
                Candidate's salary expectations must be within range
              </FormDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{field.value ? 'Yes' : 'No'}</span>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-primary"
                />
              </FormControl>
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="skillsEssential"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-white">
            <div className="space-y-0.5">
              <FormLabel className="text-base text-gray-900">Required Skills</FormLabel>
              <FormDescription className="text-gray-600">
                Candidate must have all required skills
              </FormDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{field.value ? 'Yes' : 'No'}</span>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-primary"
                />
              </FormControl>
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="qualificationEssential"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-white">
            <div className="space-y-0.5">
              <FormLabel className="text-base text-gray-900">Qualification</FormLabel>
              <FormDescription className="text-gray-600">
                Candidate must have required qualification
              </FormDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{field.value ? 'Yes' : 'No'}</span>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-primary"
                />
              </FormControl>
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="citizenshipEssential"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-white">
            <div className="space-y-0.5">
              <FormLabel className="text-base text-gray-900">Citizenship/Work Eligibility</FormLabel>
              <FormDescription className="text-gray-600">
                Candidate must meet citizenship/work eligibility requirements
              </FormDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{field.value ? 'Yes' : 'No'}</span>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-primary"
                />
              </FormControl>
            </div>
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
