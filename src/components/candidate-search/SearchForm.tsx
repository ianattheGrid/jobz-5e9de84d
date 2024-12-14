import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import WorkAreaField from "@/components/WorkAreaField";
import LocationField from "@/components/LocationField";
import SalaryRangeField from "@/components/SalaryRangeField";
import { searchFormSchema } from "./searchFormSchema";

interface SearchFormProps {
  onSubmit: (values: z.infer<typeof searchFormSchema>) => Promise<void>;
}

export function SearchForm({ onSubmit }: SearchFormProps) {
  const form = useForm<z.infer<typeof searchFormSchema>>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      workArea: "",
      location: [], // Change from string to array
      salary: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 text-left">
        <WorkAreaField control={form.control} />
        <LocationField control={form.control} />
        <SalaryRangeField control={form.control} />
        
        <div className="flex justify-start">
          <Button type="submit" className="bg-red-800 hover:bg-red-900">
            Search Candidates
          </Button>
        </div>
      </form>
    </Form>
  );
}