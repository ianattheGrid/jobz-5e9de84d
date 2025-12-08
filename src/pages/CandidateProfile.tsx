import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { initializeStorage } from "@/integrations/supabase/storage";
import { CandidateProfile as ProfileType } from "@/integrations/supabase/types/profiles";
import { CosmicBackground } from "@/components/ui/cosmic-background";
import { ProfileLayout } from "@/components/candidate/profile/ProfileLayout";

export default function CandidateProfile() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileType | null>(null);

  // Function to fetch profile data
  const fetchProfileData = async (uid: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('candidate_profiles')
        .select('*')
        .eq('id', uid)
        .maybeSingle();

      if (error) throw error;
      
      if (profile) {
        setProfileData(profile as unknown as ProfileType);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    // Initialize storage buckets
    initializeStorage().catch(console.error);
    
    const initializeProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user?.id) {
          setUserId(session.user.id);
          await fetchProfileData(session.user.id);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error initializing profile:', error);
        setLoading(false);
      }
    };

    initializeProfile();
  }, []);

  // Handler for profile updates
  const handleProfileUpdate = async () => {
    if (userId) {
      await fetchProfileData(userId);
    }
  };

  if (loading) {
    return (
      <CosmicBackground mode="light">
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </CosmicBackground>
    );
  }

  if (!userId) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-muted-foreground">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <ProfileLayout
      userId={userId}
      profileData={profileData}
      onProfileUpdate={handleProfileUpdate}
    />
  );
}
