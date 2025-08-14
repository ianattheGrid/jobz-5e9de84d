import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { VacancyFormValues } from "./VacancyFormSchema";

interface CompanyVisibilityFieldProps {
  form: UseFormReturn<VacancyFormValues>;
}

export function CompanyVisibilityField({ form }: CompanyVisibilityFieldProps) {
  return (
    <div className="space-y-6 p-6 bg-card rounded-lg border">
      <div>
        <h3 className="text-lg font-semibold mb-2">Company Visibility</h3>
        <p className="text-sm text-muted-foreground">
          Choose whether to display your company name on this job vacancy.
        </p>
      </div>
      
      <FormField
        control={form.control}
        name="showCompanyName"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-base font-medium">
              Do you want your company name visible on this job vacancy?
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={(value) => field.onChange(value === "true")}
                value={field.value ? "true" : "false"}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="visible" />
                  <label 
                    htmlFor="visible" 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Yes, show my company name
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="hidden" />
                  <label 
                    htmlFor="hidden" 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    No, keep my company name hidden (job will show as "Anonymous Company")
                  </label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}