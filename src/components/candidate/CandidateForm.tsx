
import { Form } from "@/components/ui/form";
import FormSections from "./sections/FormSections";
import SubmitButton from "./sections/SubmitButton";
import { useCandidateForm } from "@/hooks/useCandidateForm";
import { useEffect } from "react";

export function CandidateForm() {
  const { form, handleSubmit, isSubmitting } = useCandidateForm();

  // Debug form values
  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log("Form values changed:", value);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 w-full max-w-2xl">
        <FormSections control={form.control} />
        <SubmitButton isSubmitting={isSubmitting} />
      </form>
    </Form>
  );
}
