import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CandidateFormValues } from "../candidateFormSchema";

interface IndustryProfileSectionProps {
  control: Control<CandidateFormValues>;
}

const IndustryProfileSection = ({ control }: IndustryProfileSectionProps) => {
  const industryOptions = [
    "Technology",
    "Healthcare", 
    "Finance",
    "Education",
    "Manufacturing",
    "Retail",
    "Construction",
    "Real Estate",
    "Media & Entertainment",
    "Government & Public Sector",
    "Non-Profit",
    "Other"
  ];

  const contractTypes = [
    { value: "permanent", label: "Permanent" },
    { value: "contract", label: "Contract" },
    { value: "temporary", label: "Temporary" },
    { value: "freelance", label: "Freelance" },
    { value: "both", label: "Open to Both" }
  ];

  const noticePeriods = [
    "Immediate",
    "1 week",
    "2 weeks", 
    "1 month",
    "2 months",
    "3 months",
    "More than 3 months"
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold border-l-4 border-primary pl-4 mb-4">
          Professional Background
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="industry_sector"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry Sector</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {industryOptions.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="contract_type_preference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contract Type Preference</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select contract type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {contractTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormField
            control={control}
            name="notice_period"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notice Period</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select notice period" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {noticePeriods.map((period) => (
                      <SelectItem key={period} value={period}>
                        {period}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="company_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Company Address (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., London, UK" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default IndustryProfileSection;