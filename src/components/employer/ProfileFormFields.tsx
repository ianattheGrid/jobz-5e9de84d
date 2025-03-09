
import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ProfileFormFieldsProps {
  control: Control<any>;
}

export function ProfileFormFields({ control }: ProfileFormFieldsProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="company_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-900 font-medium">Company Name</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter company name" 
                className="bg-white border-gray-200 text-gray-900" 
                {...field} 
              />
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
            <FormLabel className="text-gray-900 font-medium">Company Website</FormLabel>
            <FormControl>
              <Input 
                placeholder="https://www.example.com" 
                className="bg-white border-gray-200 text-gray-900" 
                {...field} 
              />
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
            <FormLabel className="text-gray-900 font-medium">Full Name</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter your full name" 
                className="bg-white border-gray-200 text-gray-900" 
                {...field} 
              />
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
            <FormLabel className="text-gray-900 font-medium">Job Title</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter your job title" 
                className="bg-white border-gray-200 text-gray-900" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
