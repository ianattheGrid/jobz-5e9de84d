import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface VacancyCoreFieldsProps {
  control: Control<any>;
}

/**
 * Job title, location and description for a vacancy.
 * These are required by the database and were previously missing from the form,
 * which made the "Post Vacancy" button fail silently.
 */
const VacancyCoreFields = ({ control }: VacancyCoreFieldsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Title (required)</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g. 1st Line Support Engineer"
                className="bg-white text-gray-900"
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location (required)</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g. Bristol"
                className="bg-white text-gray-900"
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Description (required)</FormLabel>
            <FormControl>
              <Textarea
                rows={8}
                placeholder="Describe the role, the team and what a typical week looks like."
                className="bg-white text-gray-900"
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormDescription className="text-gray-600">
              Between 10 and 2000 characters.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default VacancyCoreFields;
