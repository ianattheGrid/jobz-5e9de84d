
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Control } from "react-hook-form";
import { useEffect, useState } from "react";
import { MultiSelect } from "@/components/ui/multi-select";
import { useJobTitles } from "@/hooks/useJobTitles";
import JobTitleSuggestionForm from "@/components/job-titles/JobTitleSuggestionForm";

interface JobTitleSelectProps {
  control: Control<any>;
  titles: string[];
  name: string;
  workArea?: string;
  specialization?: string;
}

const JobTitleSelect = ({ control, titles, name, workArea, specialization }: JobTitleSelectProps) => {
  const [filteredTitles, setFilteredTitles] = useState<string[]>([]);
  const { jobTitles, loading, refetch } = useJobTitles(workArea, specialization);
  
  useEffect(() => {
    // Combine static titles with database job titles
    const dbTitles = jobTitles.map(jt => jt.job_title);
    const allTitles = [...titles, ...dbTitles];
    
    // Filter out empty/null titles and remove duplicates
    const validTitles = allTitles
      .filter(title => title && title.trim() !== '')
      .filter((title, index, self) => self.indexOf(title) === index)
      .sort();
    
    setFilteredTitles(validTitles);
  }, [titles, jobTitles, specialization]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Debug current field value
        console.log(`JobTitleSelect field value for ${name}:`, field.value);
        
        // Convert single string value to array if needed
        const currentValues = Array.isArray(field.value) 
          ? field.value 
          : field.value 
            ? [field.value] 
            : [];
        
        // Create options for MultiSelect
        const options = filteredTitles.map(title => ({
          value: title,
          label: title
        }));

        console.log("JobTitleSelect options:", options);
        
        return (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel>Job Titles (Select up to 5)</FormLabel>
              {workArea && (
                <JobTitleSuggestionForm 
                  workArea={workArea} 
                  onSuggestionSubmitted={refetch}
                />
              )}
            </div>
            <FormDescription>
              Select multiple job titles that match your experience. This helps employers find you for suitable positions.
            </FormDescription>
            <FormControl>
              {filteredTitles.length > 0 ? (
                <MultiSelect
                  options={options}
                  selected={currentValues}
                  onChange={(values) => field.onChange(values)}
                  placeholder="Click to select job titles..."
                  className="min-h-[42px]"
                />
              ) : (
                <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
                  Please select a work area and specialization first to see available job titles
                </div>
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default JobTitleSelect;
