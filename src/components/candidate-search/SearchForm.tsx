
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import WorkAreaField from "@/components/WorkAreaField";
import SalaryRangeField from "@/components/SalaryRangeField";
import { searchFormSchema } from "./searchFormSchema";
import ITSkillsField from "@/components/job-details/ITSkillsField";
import SecurityClearanceFields from "@/components/job-details/SecurityClearanceFields";
import SignupPeriodField from "./SignupPeriodField";
import WorkEligibilityField from "@/components/job-details/WorkEligibilityField";
import CommissionPercentageField from "./CommissionPercentageField";
import QualificationField from "@/components/shared/QualificationField";

interface SearchFormProps {
  onSubmit: (values: z.infer<typeof searchFormSchema>) => Promise<void>;
}

export function SearchForm({ onSubmit }: SearchFormProps) {
  const form = useForm<z.infer<typeof searchFormSchema>>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      workArea: "",
      officePostcode: "",
      searchRadius: undefined,
      salary: "",
      requiresQualification: false,
      qualificationRequired: "",
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <WorkAreaField control={form.control} />
            <SalaryRangeField control={form.control} />
            <CommissionPercentageField control={form.control} />
          </div>
          
          <div className="space-y-6">
            <QualificationField control={form.control} />
            <ITSkillsField control={form.control} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <SecurityClearanceFields control={form.control} />
          </div>
          
          <div className="space-y-6">
            <WorkEligibilityField control={form.control} />
            <SignupPeriodField control={form.control} />
          </div>
        </div>
        
        <div className="flex justify-end mt-8">
          <Button 
            type="submit" 
            className="bg-[#FF69B4] hover:bg-[#FF69B4]/90 text-white w-full sm:w-auto px-8"
          >
            Search Candidates
          </Button>
        </div>
      </form>
    </Form>
  );
}
