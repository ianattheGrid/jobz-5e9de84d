import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { JobSearchSchema, jobSearchSchema } from "./JobSearchSchema";
import CommissionFilterField from "./CommissionFilterField";

interface JobSearchProps {
  onSearch: (data: JobSearchSchema) => void;
}

const JobSearch = ({ onSearch }: JobSearchProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const form = useForm<JobSearchSchema>({
    resolver: zodResolver(jobSearchSchema),
    defaultValues: {
      keyword: "",
      location: "",
      hasCommission: false,
    },
  });

  const onSubmit = (data: JobSearchSchema) => {
    onSearch(data);
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-4 mb-6 text-left">
      <div 
        className="flex items-center cursor-pointer mb-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Search className="h-5 w-5 text-white mr-2" />
        <h2 className="text-lg font-semibold text-white">
          Find Your Perfect Job Match
        </h2>
      </div>

      {isExpanded && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="keyword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Job title, keywords, or company"
                      className="bg-muted text-white"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Location"
                      className="bg-muted text-white"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

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