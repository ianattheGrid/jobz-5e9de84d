
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ProfileDetails from "@/components/candidate-profile/ProfileDetails";
import { CandidateProfile } from "@/integrations/supabase/types/profiles";
import { useToast } from "@/hooks/use-toast";

function PreviewCandidateProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Extract the user ID from query parameters
  const queryParams = new URLSearchParams(location.search);
  const candidateId = queryParams.get('id');

  useEffect(() => {
    async function loadProfileData() {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Preview page - Loading profile with ID:", candidateId);
        
        // First try to load profile from the ID parameter
        if (candidateId) {
          console.log("Attempting to load profile with candidateId:", candidateId);
          
          const { data: profileData, error: profileError } = await supabase
            .from('candidate_profiles')
            .select('*')
            .eq('id', candidateId)
            .maybeSingle();

          if (profileError) {
            console.error("Error fetching profile by ID:", profileError);
            setError("Could not load profile data");
            setLoading(false);
            return;
          }

          if (profileData) {
            console.log("Profile found by ID:", profileData.id, profileData.full_name);
            setProfile(profileData as unknown as CandidateProfile);
            setLoading(false);
            return;
          } else {
            console.log("No profile found with ID:", candidateId);
            setError("Profile not found");
            setLoading(false);
            return;
          }
        } else {
          // No ID parameter was provided
          setError("No profile ID was provided");
          setLoading(false);
        }
      } catch (err) {
        console.error("Error in preview:", err);
        setError("An unexpected error occurred");
        setLoading(false);
      }
    }

    loadProfileData();
  }, [candidateId]);

  // Handle go back button
  const handleGoBack = () => {
    if (window.opener) {
      // If opened in new tab/window, close it
      window.close();
    } else {
      navigate(-1); // Navigate back to previous page
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
        
        <Button 
          variant="outline"
          onClick={handleGoBack}
          className="mr-4"
        >
          Go Back
        </Button>
      </div>
    );
  }

  // Show profile preview
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl bg-gray-50">
      <Button
        variant="outline"
        onClick={handleGoBack}
        className="mb-6 flex items-center gap-2 bg-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="bg-pink-100 border-l-4 border-pink-500 p-4 mb-6">
        <p className="text-pink-700 font-medium">Preview Mode</p>
        <p className="text-sm text-pink-600">This is how the candidate profile appears to employers after they request to view the details.</p>
      </div>

      {profile && <ProfileDetails profile={profile} />}
    </div>
  );
}

export default PreviewCandidateProfile;
