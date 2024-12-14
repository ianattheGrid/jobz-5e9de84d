import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { VacancyFormValues } from "./VacancyFormSchema";
import WorkAreaField from "@/components/WorkAreaField";
import LocationField from "@/components/LocationField";
import JobDetailsFields from "@/components/JobDetailsFields";
import CommissionSection from "@/components/CommissionSection";
import ApplicationPreferencesField from "@/components/ApplicationPreferencesField";
import MatchThresholdField from "./MatchThresholdField";

interface VacancyFormProps {
  form: UseFormReturn<VacancyFormValues>;
  onSubmit: (values: VacancyFormValues) => Promise<void>;
}

export function VacancyForm({ form, onSubmit }: VacancyFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 text-left">
        <div className="space-y-8 [&_label]:text-black [&_h3]:text-black">
          <WorkAreaField control={form.control} />
          <LocationField control={form.control} />
          <JobDetailsFields control={form.control} />
          <MatchThresholdField control={form.control} />
          <CommissionSection salary={form.watch("actualSalary")} form={form} />
          <ApplicationPreferencesField control={form.control} />
        </div>
        <div className="flex justify-start">
          <Button type="submit" className="bg-red-800 hover:bg-red-900 text-white">Post Vacancy</Button>
        </div>
      </form>
    </Form>
  );
}