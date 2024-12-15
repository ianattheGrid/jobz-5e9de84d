import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import WorkAreaField from "@/components/WorkAreaField";
import LocationField from "@/components/LocationField";
import SalaryRangeField from "@/components/SalaryRangeField";
import { Search } from "lucide-react";

const searchFormSchema = z.object({
  workArea: z.string().optional(),
  location: z.array(z.string()),
  salary: z.string().optional(),
  title: z.string().optional(),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

interface JobSearchProps {
  onSearch: (values: SearchFormValues) => void;
}

const JobSearch = ({ onSearch }: JobSearchProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      workArea: "",
      location: [],
      salary: "",
      title: "",
    },
  });

  const handleSubmit = (values: SearchFormValues) => {
    onSearch(values);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <div 
        className="flex items-center cursor-pointer mb-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Search className="h-5 w-5 text-red-800 mr-2" />
        <h2 className="text-lg font-semibold text-red-800">Search Jobs</h2>
      </div>

      {isExpanded && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <WorkAreaField control={form.control} />
            <LocationField control={form.control} />
            <SalaryRangeField control={form.control} />
            
            <div className="flex justify-end">
              <Button 
                type="submit"
                className="bg-red-800 hover:bg-red-900 text-white"
              >
                Search
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default JobSearch;