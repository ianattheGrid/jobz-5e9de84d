import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { FormValues } from "./ProfileForm";
import { Linkedin } from "lucide-react";

interface ProfileFormFieldsProps {
  control: Control<FormValues>;
}

export const ProfileFormFields = ({ control }: ProfileFormFieldsProps) => {
  return (
    <>
      <FormField
        control={control}
        name="company_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter company name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="full_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter your full name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="job_title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter your job title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="linkedin_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>LinkedIn Company Profile</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  placeholder="https://www.linkedin.com/company/..." 
                  {...field} 
                  className="pl-10"
                />
                <Linkedin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};