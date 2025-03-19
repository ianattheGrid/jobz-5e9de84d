
import { Form } from "@/components/ui/form";
import FormSections from "./sections/FormSections";
import SubmitButton from "./sections/SubmitButton";
import { useCandidateForm } from "@/hooks/useCandidateForm";
import { useEffect } from "react";

export function CandidateForm() {
  const { form, handleSubmit, isSubmitting, isLoading } = useCandidateForm();

  // Debug form values but only when values actually change, not on every render
  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log("Form values changed:", value);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 w-full max-w-2xl">
        <FormSections control={form.control} />
        <SubmitButton isSubmitting={isSubmitting} />
      </form>
    </Form>
  );
}
