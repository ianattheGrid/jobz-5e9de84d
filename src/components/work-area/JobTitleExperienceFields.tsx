
import React from "react";
import { Control } from "react-hook-form";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

const YEARS_OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20];

interface JobTitleExperienceFieldsProps {
  control: Control<any>;
  jobTitles: string[];
}

const JobTitleExperienceFields = ({ control, jobTitles }: JobTitleExperienceFieldsProps) => {
  return (
    <div className="space-y-3">
      <FormLabel>Minimum years experience in each job title</FormLabel>
      <Card>
        <CardContent className="pt-4">
          <div className="space-y-3">
            {jobTitles.map((title, index) => (
              <FormField
                key={`${title}-${index}`}
                control={control}
                name={`titleExperience.${title}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{title}</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={(value) => field.onChange(Number(value))} 
                        value={String(field.value || "0")}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select years of experience" />
                        </SelectTrigger>
                        <SelectContent>
                          {YEARS_OPTIONS.map((years) => (
                            <SelectItem key={years} value={String(years)}>
                              {years === 20 ? "20+ years" : `${years} ${years === 1 ? "year" : "years"}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobTitleExperienceFields;
