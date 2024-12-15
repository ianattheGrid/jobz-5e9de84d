import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import WorkAreaField from "@/components/WorkAreaField";
import SalaryRangeField from "@/components/SalaryRangeField";
import CommissionFilterField from "./CommissionFilterField";
import { jobSearchSchema, type JobSearchValues } from "./JobSearchSchema";

interface JobSearchProps {
  onSearch: (values: JobSearchValues) => void;
}

const JobSearch = ({ onSearch }: JobSearchProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const form = useForm<JobSearchValues>({
    resolver: zodResolver(jobSearchSchema),
    defaultValues: {
      workArea: "",
      salary: "",
      title: "",
      includeCommission: false,
    },
  });

  const handleSubmit = (values: JobSearchValues) => {
    onSearch(values);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6 text-left">
      <div 
        className="flex items-center cursor-pointer mb-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Search className="h-5 w-5 text-red-800 mr-2" />
        <h2 className="text-lg font-semibold text-red-800">
          Find Your Perfect Job Match
        </h2>
      </div>

      {isExpanded && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <WorkAreaField control={form.control} />
            <SalaryRangeField control={form.control} />
            <CommissionFilterField control={form.control} />
            
            <div className="flex justify-start">
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