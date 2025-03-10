
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { JobSearchSchema, jobSearchSchema } from "./JobSearchSchema";
import CommissionFilterField from "./CommissionFilterField";
import WorkAreaField from "@/components/WorkAreaField";
import { PRIMARY_COLOR_PATTERN } from "@/styles/colorPatterns";
import BristolPostcodeSelect from "./BristolPostcodeSelect";

interface JobSearchProps {
  onSearch: (data: JobSearchSchema) => void;
}

const JobSearch = ({ onSearch }: JobSearchProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const form = useForm<JobSearchSchema>({
    resolver: zodResolver(jobSearchSchema),
    defaultValues: {
      workArea: "",
      specialization: "",
      title: "",
      location: [], // Changed from string to empty array to match the schema type
      hasCommission: false,
    },
  });

  const onSubmit = (data: JobSearchSchema) => {
    onSearch(data);
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-4 mb-6 text-left">
      <div 
        className="flex flex-col cursor-pointer mb-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center mb-2">
          <Search className="h-5 w-5 text-primary mr-2" />
          <h2 className={`text-lg font-semibold ${PRIMARY_COLOR_PATTERN}`}>
            Find Your Perfect Job Match (Click here)
          </h2>
        </div>
        <p className="text-sm text-muted-foreground ml-7">
          Search jobs by sector, specialization, or filter by Bristol postcodes and jobs with "You're Hired" bonuses
        </p>
      </div>

      {isExpanded && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <WorkAreaField control={form.control} />
              <div className="space-y-2">
                <label className="text-white font-medium text-base">
                  Select Bristol Area
                </label>
                <BristolPostcodeSelect control={form.control} />
              </div>
              <CommissionFilterField control={form.control} />
            </div>

            <div className="flex justify-start">
              <Button 
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Search Jobs
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default JobSearch;
