
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Control } from "react-hook-form";
import { useEffect, useState } from "react";
import { MultiSelect } from "@/components/ui/multi-select";

interface JobTitleSelectProps {
  control: Control<any>;
  titles: string[];
  name: string;
}

const JobTitleSelect = ({ control, titles, name }: JobTitleSelectProps) => {
  // Ensure we don't have empty titles list
  const [filteredTitles, setFilteredTitles] = useState<string[]>([]);
  
  useEffect(() => {
    // Filter out empty titles and remove duplicates
    if (titles && titles.length > 0) {
      setFilteredTitles([...new Set(titles.filter(title => !!title))]);
    }
  }, [titles]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
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
        
        return (
          <FormItem>
            <FormLabel>Job Titles</FormLabel>
            <FormDescription>
              Select multiple job titles that match your experience. This helps employers find you for suitable positions.
            </FormDescription>
            <FormControl>
              {filteredTitles.length > 0 ? (
                <MultiSelect
                  options={options}
                  selected={currentValues}
                  onChange={(values) => field.onChange(values)}
                  placeholder="Select job titles"
                />
              ) : (
                <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
                  No job titles available
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
