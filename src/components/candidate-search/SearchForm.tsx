import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import WorkAreaField from "@/components/WorkAreaField";
import SalaryRangeField from "@/components/SalaryRangeField";
import { searchFormSchema } from "./searchFormSchema";
import QualificationSelector from "@/components/job-details/QualificationSelector";
import ITSkillsField from "@/components/job-details/ITSkillsField";
import SecurityClearanceFields from "@/components/job-details/SecurityClearanceFields";
import SignupPeriodField from "./SignupPeriodField";
import WorkEligibilityField from "@/components/job-details/WorkEligibilityField";
import CommissionPercentageField from "./CommissionPercentageField";
import LocationInput from "./LocationInput";
import RadiusSearch from "./RadiusSearch";

interface SearchFormProps {
  onSubmit: (values: z.infer<typeof searchFormSchema>) => Promise<void>;
}

export function SearchForm({ onSubmit }: SearchFormProps) {
  const form = useForm<z.infer<typeof searchFormSchema>>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      workArea: "",
      location: "",
      officePostcode: "",
      searchRadius: undefined,
      salary: "",
      qualification: "None",
      required_skills: [],
      requiresSecurityClearance: false,
      securityClearanceLevel: undefined,
      signupPeriod: "",
      workEligibility: undefined,
      includeCommissionCandidates: false,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 text-left">
        <WorkAreaField control={form.control} />
        <LocationInput control={form.control} />
        <RadiusSearch control={form.control} />
        <SalaryRangeField control={form.control} />
        <CommissionPercentageField control={form.control} />
        
        <FormField
          control={form.control}
          name="qualification"
          render={({ field }) => (
            <FormItem>
              <FormLabel>IT Qualification</FormLabel>
              <FormControl>
                <QualificationSelector
                  selectedQualification={field.value}
                  onSelect={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ITSkillsField control={form.control} />
        <SecurityClearanceFields control={form.control} />
        <WorkEligibilityField control={form.control} />
        <SignupPeriodField control={form.control} />
        
        <div className="flex justify-start">
          <Button type="submit" className="bg-red-800 hover:bg-red-900 text-white">
            Search Candidates
          </Button>
        </div>
      </form>
    </Form>
  );
}