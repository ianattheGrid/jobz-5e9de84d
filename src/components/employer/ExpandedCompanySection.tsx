import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormValues } from "./ProfileForm";

interface ExpandedCompanySectionProps {
  control: Control<FormValues>;
}

export const ExpandedCompanySection = ({ control }: ExpandedCompanySectionProps) => {
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

  const remoteWorkPolicies = [
    { value: "office_based", label: "Office Based" },
    { value: "remote_friendly", label: "Remote Friendly" },
    { value: "hybrid", label: "Hybrid" },
    { value: "fully_remote", label: "Fully Remote" }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold border-l-4 border-primary pl-4">Company Profile</h3>
      
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
          name="remote_work_policy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remote Work Policy</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select remote work policy" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {remoteWorkPolicies.map((policy) => (
                    <SelectItem key={policy.value} value={policy.value}>
                      {policy.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="company_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Address</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 123 Business St, Bristol" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="company_postcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Postcode</FormLabel>
              <FormControl>
                <Input placeholder="e.g., BS1 2AB" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="company_culture"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Culture</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe your company culture, values, and work environment..."
                className="resize-none"
                rows={3}
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};