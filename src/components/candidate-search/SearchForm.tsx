import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import WorkAreaField from "@/components/WorkAreaField";
import SalaryRangeField from "@/components/SalaryRangeField";
import { searchFormSchema } from "./searchFormSchema";
import ITSkillsField from "@/components/job-details/ITSkillsField";
import SecurityClearanceFields from "@/components/job-details/SecurityClearanceFields";
import SignupPeriodField from "./SignupPeriodField";
import CommissionPercentageField from "./CommissionPercentageField";
import QualificationField from "@/components/shared/QualificationField";
import { useSavedSearches } from "@/hooks/search/useSavedSearches";

interface SearchFormProps {
  onSubmit: (values: z.infer<typeof searchFormSchema>) => Promise<void>;
}

export function SearchForm({ onSubmit }: SearchFormProps) {
  const { saveSearch } = useSavedSearches();
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
      includeCommissionCandidates: false,
    },
  });

  const handleSaveSearch = () => {
    const values = form.getValues();
    saveSearch({
      work_area: values.workArea,
      specialization: values.itSpecialization,
      min_salary: parseInt(values.salary.split(" - ")[0].replace(/[£,]/g, "")),
      max_salary: parseInt(values.salary.split(" - ")[1].replace(/[£,]/g, "")),
      required_skills: values.required_skills || [],
      required_qualifications: values.requiresQualification ? [values.qualificationRequired || ""] : [],
      match_threshold: 60,
    });
  };

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
            <SignupPeriodField control={form.control} />
          </div>
        </div>
        
        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveSearch}
            className="bg-secondary hover:bg-secondary/90"
          >
            Save Search
          </Button>
          
          <Button 
            type="submit" 
            className="bg-[#FF69B4] hover:bg-[#FF69B4]/90 text-white"
          >
            Search Candidates
          </Button>
        </div>
      </form>
    </Form>
  );
}
