
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormValues } from "./ProfileForm";

interface ProfileFormFieldsProps {
  control: Control<FormValues>;
}

export const ProfileFormFields = ({ control }: ProfileFormFieldsProps) => {
  const validateUrl = (url: string) => {
    if (!url) return true;
    
    // Add http:// or https:// if missing
    let urlToCheck = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      urlToCheck = 'https://' + url;
    }
    
    try {
      new URL(urlToCheck);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold border-l-4 border-primary pl-4">Personal Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
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
                <Input placeholder="HR Manager" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <h3 className="text-xl font-semibold border-l-4 border-primary pl-4 mt-8">Company Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="company_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Acme Inc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="company_website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Website</FormLabel>
              <FormControl>
                <Input 
                  placeholder="www.example.com" 
                  {...field} 
                  onChange={(e) => {
                    field.onChange(e);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="company_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Email</FormLabel>
              <FormControl>
                <Input placeholder="contact@company.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="company_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Tel</FormLabel>
              <FormControl>
                <Input placeholder="+44 123 456 7890" type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
