
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
        <div className="flex items-center">
          <Search className="h-5 w-5 text-primary mr-2" />
          <h2 className={`text-lg font-semibold ${PRIMARY_COLOR_PATTERN}`}>
            Find Your Perfect Job Match
          </h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExpandToggle}
          className="border border-gray-200 bg-white text-gray-700 hover:bg-primary hover:text-white hover:border-primary transition-colors"
        >
          {isExpanded ? (
            <>
              <X className="h-4 w-4 mr-1" />
              Collapse
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-1" />
              Search
            </>
          )}
        </Button>
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
                className="bg-[#FF69B4] hover:bg-[#FF50A8] text-white"
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
