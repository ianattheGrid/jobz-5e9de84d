import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { CandidateFormValues } from "../candidateFormSchema";
import { FileUploadSection } from "../FileUploadSection";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "lucide-react";
import BristolPostcodeSelect from "@/components/address/BristolPostcodeSelect";
import HomePostcodeSelect from "@/components/address/HomePostcodeSelect";
import TitleExperienceSelect from "@/components/work-area/TitleExperienceSelect";

interface ContactInformationProps {
  control: Control<CandidateFormValues>;
}

const ContactInformation = ({ control }: ContactInformationProps) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<{ 
    profile_picture_url: string | null; 
    cv_url: string | null;
  } | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserId(session.user.id);
        
        const { data: profileData } = await supabase
          .from('candidate_profiles')
          .select('profile_picture_url, cv_url')
          .eq('id', session.user.id)
          .maybeSingle();
          
        setProfile(profileData);
      }
    };
    
    getSession();
  }, []);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
        
        <FormField
          control={control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-900">Full Name</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Enter your full name" 
                  className="bg-zinc-900 text-white border-zinc-700 placeholder:text-gray-400"
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-900">Email Address</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="email"
                  placeholder="Enter your email address" 
                  className="bg-zinc-900 text-white border-zinc-700 placeholder:text-gray-400"
                  value={field.value || ''}
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
                  {...field} 
                  type="tel" 
                  placeholder="Enter your phone number" 
                  className="bg-zinc-900 text-white border-zinc-700 placeholder:text-gray-400"
                  value={field.value || ''}
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
                    {...field} 
                    type="url" 
                    placeholder="https://www.linkedin.com/in/your-profile" 
                    className="bg-zinc-900 text-white border-zinc-700 placeholder:text-gray-400 pl-10"
                    value={field.value || ''}
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
                  {...field}
                  placeholder="Enter your current employer's name" 
                  className="bg-zinc-900 text-white border-zinc-700 placeholder:text-gray-400"
                  value={field.value || ''}
                />
              </FormControl>
              <p className="text-sm text-gray-600 mt-1">
                This helps us ensure you don't accidentally apply to positions at your current company
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="years_in_current_title"
          render={({ field }) => (
            <TitleExperienceSelect
              control={control}
              name="years_in_current_title"
              label="Years of experience in your current job title"
            />
          )}
        />

        <FormItem>
          <HomePostcodeSelect control={control} />
        </FormItem>

        <FormItem>
          <FormLabel className="text-gray-900">What Bristol locations are you willing to work in?</FormLabel>
          <BristolPostcodeSelect control={control} />
        </FormItem>

        {userId && (
          <FileUploadSection
            userId={userId}
            currentProfilePicture={profile?.profile_picture_url}
            currentCV={profile?.cv_url}
          />
        )}
      </div>
    </div>
  );
};

export default ContactInformation;
