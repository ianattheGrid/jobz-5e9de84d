
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { useEffect, useState } from "react";

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
        // Make sure we have a valid value
        const validValue = field.value && filteredTitles.length > 0 
          ? (filteredTitles.includes(field.value) ? field.value : filteredTitles[0])
          : "";
        
        return (
          <FormItem>
            <FormLabel>Job Title</FormLabel>
            <FormControl>
              <Select 
                onValueChange={field.onChange} 
                value={validValue}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select job title" />
                </SelectTrigger>
                <SelectContent>
                  {filteredTitles.map((title) => (
                    <SelectItem key={title} value={title}>
                      {title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default JobTitleSelect;
