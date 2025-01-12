import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import WorkAreaSelect from "@/components/work-area/selectors/WorkAreaSelect";
import SalaryRangeField from "@/components/SalaryRangeField";
import CommissionFilterField from "./CommissionFilterField";
import { jobSearchSchema, type JobSearchValues } from "./JobSearchSchema";
import { 
  ITSpecializationSelect,
  CustomerServiceSpecializationSelect,
  FinanceSpecializationSelect,
  PublicSectorSpecializationSelect,
  EngineeringSpecializationSelect,
  HospitalitySpecializationSelect
} from "@/components/work-area/specializations";

interface JobSearchProps {
  onSearch: (values: JobSearchValues) => void;
}

const JobSearch = ({ onSearch }: JobSearchProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedWorkArea, setSelectedWorkArea] = useState<string>("");

  const form = useForm<JobSearchValues>({
    resolver: zodResolver(jobSearchSchema),
    defaultValues: {
      workArea: "",
      specialization: "",
      salary: "",
      title: "",
      includeCommission: false,
    },
  });

  const handleSubmit = (values: JobSearchValues) => {
    onSearch(values);
  };

  const renderSpecializationSelect = () => {
    switch (selectedWorkArea) {
      case "IT":
        return (
          <ITSpecializationSelect
            control={form.control}
            onSpecializationChange={(value) => {
              form.setValue("specialization", value);
            }}
          />
        );
      case "Customer Service":
        return (
          <CustomerServiceSpecializationSelect
            control={form.control}
            onSpecializationChange={(value) => {
              form.setValue("specialization", value);
            }}
          />
        );
      case "Accounting & Finance":
        return (
          <FinanceSpecializationSelect
            control={form.control}
            onSpecializationChange={(value) => {
              form.setValue("specialization", value);
            }}
          />
        );
      case "Public Sector":
        return (
          <PublicSectorSpecializationSelect
            control={form.control}
            onSpecializationChange={(value) => {
              form.setValue("specialization", value);
            }}
          />
        );
      case "Engineering":
        return (
          <EngineeringSpecializationSelect
            control={form.control}
            onSpecializationChange={(value) => {
              form.setValue("specialization", value);
            }}
          />
        );
      case "Hospitality & Tourism":
        return (
          <HospitalitySpecializationSelect
            control={form.control}
            onSpecializationChange={(value) => {
              form.setValue("specialization", value);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-4 mb-6 text-left">
      <div 
        className="flex items-center cursor-pointer mb-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Search className="h-5 w-5 text-primary mr-2" />
        <h2 className="text-lg font-semibold text-primary">
          Find Your Perfect Job Match
        </h2>
      </div>

      {isExpanded && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <WorkAreaSelect 
              control={form.control}
              onWorkAreaChange={(value) => {
                setSelectedWorkArea(value);
                form.setValue("workArea", value);
                form.setValue("specialization", "");
              }}
            />
            
            {selectedWorkArea && renderSpecializationSelect()}
            
            <SalaryRangeField control={form.control} />
            <CommissionFilterField control={form.control} />
            
            <div className="flex justify-start">
              <Button 
                type="submit"
                className="btn-white"
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