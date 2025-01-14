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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { bristolPostcodes } from "@/data/bristolPostcodes";
import { Checkbox } from "@/components/ui/checkbox";

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
  const [selectedPostcodes, setSelectedPostcodes] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

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

  const handlePostcodeChange = (postcode: string) => {
    if (postcode === "all") {
      setSelectAll(!selectAll);
      setSelectedPostcodes(selectAll ? [] : bristolPostcodes);
      return;
    }

    const updatedPostcodes = selectedPostcodes.includes(postcode)
      ? selectedPostcodes.filter(p => p !== postcode)
      : [...selectedPostcodes, postcode];
    
    setSelectedPostcodes(updatedPostcodes);
  };

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
                <Input placeholder="Enter your full name" {...field} className="bg-card text-foreground" />
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
              <FormLabel className="text-foreground">Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} className="bg-card text-foreground" />
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
                <Input type="tel" placeholder="Enter your phone number" {...field} className="bg-card text-foreground" />
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
                  placeholder="Enter your current employer's name" 
                  {...field} 
                  className="bg-card text-foreground"
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

        <FormField
          control={control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Locations you are looking to work in</FormLabel>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectAll}
                    onCheckedChange={() => handlePostcodeChange("all")}
                    className="bg-card border-primary"
                  />
                  <label className="text-foreground">Select All Bristol Postcodes</label>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {bristolPostcodes.map((postcode) => (
                    <div key={postcode} className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedPostcodes.includes(postcode)}
                        onCheckedChange={() => handlePostcodeChange(postcode)}
                        className="bg-card border-primary"
                      />
                      <label className="text-foreground">{postcode}</label>
                    </div>
                  ))}
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

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