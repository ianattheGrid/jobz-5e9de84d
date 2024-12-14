import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import WorkAreaField from "@/components/WorkAreaField";
import LocationField from "@/components/LocationField";
import SalaryRangeField from "@/components/SalaryRangeField";
import { searchFormSchema } from "./searchFormSchema";
import QualificationSelector from "@/components/job-details/QualificationSelector";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

interface SearchFormProps {
  onSubmit: (values: z.infer<typeof searchFormSchema>) => Promise<void>;
}

export function SearchForm({ onSubmit }: SearchFormProps) {
  const form = useForm<z.infer<typeof searchFormSchema>>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      workArea: "",
      location: [],
      salary: "",
      qualification: "None",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 text-left">
        <WorkAreaField control={form.control} />
        <LocationField control={form.control} />
        <SalaryRangeField control={form.control} />
        
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
        
        <div className="flex justify-start">
          <Button type="submit" className="bg-red-800 hover:bg-red-900">
            Search Candidates
          </Button>
        </div>
      </form>
    </Form>
  );
}