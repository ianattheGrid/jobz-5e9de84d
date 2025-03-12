
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { JobSearchSchema, jobSearchSchema } from "./JobSearchSchema";
import CommissionFilterField from "./CommissionFilterField";
import WorkAreaField from "@/components/WorkAreaField";
import { PRIMARY_COLOR_PATTERN } from "@/styles/colorPatterns";
import BristolPostcodeSelect from "./BristolPostcodeSelect";
import JobDetailsFields from "@/components/JobDetailsFields";

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
      location: [],
      hasCommission: false,
      min_salary: undefined,
      max_salary: undefined,
      description: "",
      workLocation: "office",
      holidayEntitlement: undefined,
      companyBenefits: undefined,
    },
  });

  const onSubmit = (data: JobSearchSchema) => {
    onSearch(data);
  };

  const handleExpandToggle = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
      form.reset();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 text-left">
      <div className="flex justify-between items-start mb-4">
        <div 
          className="flex flex-col cursor-pointer"
          onClick={handleExpandToggle}
        >
          <div className="flex items-center mb-2">
            <Search className="h-5 w-5 text-primary mr-2" />
            <h2 className={`text-lg font-semibold ${PRIMARY_COLOR_PATTERN}`}>
              Find Your Perfect Job Match (Click here)
            </h2>
          </div>
          <p className="text-sm text-gray-600 ml-7">
            Search jobs by sector, specialization, or filter by Bristol postcodes and jobs with "You're Hired" bonuses
          </p>
        </div>
        {isExpanded && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExpandToggle}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            Collapse
          </Button>
        )}
      </div>

      {isExpanded && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <WorkAreaField control={form.control} />
              <div className="space-y-2">
                <label className="text-gray-900 font-medium text-base">
                  Select Bristol Area
                </label>
                <BristolPostcodeSelect control={form.control} />
              </div>
              <JobDetailsFields control={form.control} />
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
