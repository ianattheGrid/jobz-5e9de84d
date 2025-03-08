
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { VacancyFormValues } from "./VacancyFormSchema";
import WorkAreaField from "@/components/WorkAreaField";
import JobDetailsFields from "@/components/JobDetailsFields";
import CommissionSection from "@/components/CommissionSection";
import ApplicationPreferencesField from "@/components/ApplicationPreferencesField";
import EssentialCriteriaFields from "./EssentialCriteriaFields";

interface VacancyFormProps {
  form: UseFormReturn<VacancyFormValues>;
  onSubmit: (values: VacancyFormValues) => Promise<void>;
}

export function VacancyForm({ form, onSubmit }: VacancyFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-8 p-6 bg-white rounded-lg shadow-sm">
        <div className="space-y-8">
          <div className="border-l-4 border-primary pl-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create New Vacancy</h1>
            <p className="text-primary text-lg mt-2">Post your job vacancy and find the right candidates.</p>
          </div>
          
          <div className="space-y-12">
            <div className="space-y-8 [&_label]:form-field-label [&_h3]:section-header [&_p]:form-field-description">
              <WorkAreaField control={form.control} />
              <JobDetailsFields control={form.control} />
              <EssentialCriteriaFields control={form.control} />
              <CommissionSection salary={form.watch("actualSalary")} form={form} />
              <ApplicationPreferencesField control={form.control} />
            </div>
          </div>
        </div>
        
        <div className="flex justify-start pt-6 border-t border-gray-200">
          <Button 
            type="submit" 
            className="bg-primary hover:bg-primary/90 text-white px-8 py-2.5 text-lg"
          >
            Post Vacancy
          </Button>
        </div>
      </form>
    </Form>
  );
}
