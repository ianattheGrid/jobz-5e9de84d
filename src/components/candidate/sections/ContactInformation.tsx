import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { CandidateFormValues } from "../candidateFormSchema";
import { FileUploadSection } from "../FileUploadSection";
import AddressFinder from "@/components/AddressFinder";
import TravelRadiusSelect from "./TravelRadiusSelect";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProfileCard } from "@/components/shared/ProfileCard";
import { Link } from "lucide-react";

interface ContactInformationProps {
  control: Control<CandidateFormValues>;
}

const ContactInformation = ({ control }: ContactInformationProps) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<{ 
    profile_picture_url: string | null; 
    cv_url: string | null;
    full_name: string | null;
    job_title: string | null;
    location: string | null;
    years_experience: number | null;
    required_skills: string[] | null;
  } | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserId(session.user.id);
        
        const { data: profileData } = await supabase
          .from('candidate_profiles')
          .select('profile_picture_url, cv_url, full_name, job_title, location, years_experience, required_skills')
          .eq('id', session.user.id)
          .maybeSingle();
          
        setProfile(profileData);
      }
    };
    
    getSession();
  }, []);

  return (
    <div className="space-y-8">
      {profile && (
        <ProfileCard
          profilePicture={profile.profile_picture_url}
          fullName={profile.full_name || "Your Name"}
          title={profile.job_title || "Your Title"}
          location={profile.location || undefined}
          experience={profile.years_experience ? `${profile.years_experience} years of experience` : undefined}
          skills={profile.required_skills || undefined}
        />
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Contact Information</h3>
        
        <FormField
          control={control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Full Name</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Enter your full name" 
                  className="form-field"
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
              <FormLabel className="text-foreground">Phone Number</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="tel" 
                  placeholder="Enter your phone number" 
                  className="form-field"
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
              <FormLabel className="text-foreground">LinkedIn Profile URL</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    {...field} 
                    type="url" 
                    placeholder="https://www.linkedin.com/in/your-profile" 
                    className="form-field pl-10"
                    value={field.value || ''}
                  />
                  <Link className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
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
              <FormLabel className="text-foreground">Current Employer</FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  placeholder="Enter your current employer's name" 
                  className="form-field"
                  value={field.value || ''}
                />
              </FormControl>
              <p className="text-sm text-muted-foreground mt-1">
                This helps us ensure you don't accidentally apply to positions at your current company
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel className="text-foreground">Your home postcode</FormLabel>
          <AddressFinder control={control} />
        </FormItem>

        <TravelRadiusSelect control={control} />

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