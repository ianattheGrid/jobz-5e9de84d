
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { CandidateFormValues } from "../candidateFormSchema";
import { Link } from "lucide-react";
import BristolPostcodeSelect from "@/components/address/BristolPostcodeSelect";
import HomePostcodeSelect from "@/components/address/HomePostcodeSelect";
import { useEffect } from "react";

interface ContactInformationProps {
  control: Control<CandidateFormValues>;
}

const ContactInformation = ({ control }: ContactInformationProps) => {
  // Log the control values for debugging
  useEffect(() => {
    console.log("Control in ContactInformation:", control);
  }, [control]);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
        
        <FormField
          control={control}
          name="full_name"
          render={({ field }) => {
            console.log("Full name field rendering with value:", field.value);
            return (
              <FormItem>
                <FormLabel className="text-gray-900">Full Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your full name" 
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                    value={field.value || ''}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    id={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-900">Email Address</FormLabel>
              <FormControl>
                <Input 
                  type="email"
                  placeholder="Enter your email address" 
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                  value={field.value || ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  id={field.name}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-900">Phone Number</FormLabel>
              <FormControl>
                <Input 
                  type="tel" 
                  placeholder="Enter your phone number" 
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                  value={field.value || ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  id={field.name}
                />
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
              <FormLabel className="text-gray-900">LinkedIn Profile URL</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type="url" 
                    placeholder="https://www.linkedin.com/in/your-profile" 
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 pl-10"
                    value={field.value || ''}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    id={field.name}
                  />
                  <Link className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="current_employer"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-900">Current Employer</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your current employer's name" 
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                  value={field.value || ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  id={field.name}
                />
              </FormControl>
              <p className="text-sm text-gray-600 mt-1">
                This helps us ensure you don't accidentally apply to positions at your current company
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <HomePostcodeSelect control={control} />
        </FormItem>

        <FormItem>
          <FormLabel className="text-gray-900">What Bristol locations are you willing to work in?</FormLabel>
          <BristolPostcodeSelect control={control} />
        </FormItem>
      </div>
    </div>
  );
};

export default ContactInformation;
