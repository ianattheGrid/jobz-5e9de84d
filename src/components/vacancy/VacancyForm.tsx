
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 text-left">
        <div className="space-y-8">
          <div className="border-l-4 border-primary pl-4 mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Create New Vacancy</h1>
            <p className="text-primary mt-2">Post your job vacancy and find the right candidates.</p>
          </div>
          <div className="space-y-8 [&_label]:text-gray-900 [&_label]:font-medium [&_h3]:text-gray-900 [&_h3]:text-xl [&_h3]:font-semibold [&_p]:text-primary/90">
            <WorkAreaField control={form.control} />
            <JobDetailsFields control={form.control} />
            <EssentialCriteriaFields control={form.control} />
            <CommissionSection salary={form.watch("actualSalary")} form={form} />
            <ApplicationPreferencesField control={form.control} />
          </div>
        </div>
        <div className="flex justify-start">
          <Button type="submit" className="bg-primary hover:bg-primary/90 text-white px-8">
            Post Vacancy
          </Button>
        </div>
      </form>
    </Form>
  );
}
