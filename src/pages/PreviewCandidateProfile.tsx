
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ProfileDetails from "@/components/candidate-profile/ProfileDetails";
import { CandidateProfile } from "@/integrations/supabase/types/profiles";

function PreviewCandidateProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setError("Please sign in to view your profile preview");
          return;
        }

        // Fetch profile data directly
        const { data: profileData, error: profileError } = await supabase
          .from('candidate_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          setError("Could not load profile data");
          return;
        }

        if (!profileData) {
          setError("Please complete your profile first");
          return;
        }

        setProfile(profileData as unknown as CandidateProfile);
        setError(null);
      } catch (err) {
        console.error("Error:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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
          onClick={() => navigate(-1)}
          className="mr-4"
        >
          Go Back
        </Button>
        
        <Button 
          variant="default"
          onClick={() => navigate('/candidate/signin')}
          className="bg-pink-600 hover:bg-pink-700"
        >
          Sign in as Candidate
        </Button>
      </div>
    );
  }

  // Show profile preview
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl bg-gray-50">
      <Button
        variant="outline"
        onClick={() => navigate('/candidate/profile')}
        className="mb-6 flex items-center gap-2 bg-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Profile
      </Button>

      <div className="bg-pink-100 border-l-4 border-pink-500 p-4 mb-6">
        <p className="text-pink-700 font-medium">Preview Mode</p>
        <p className="text-sm text-pink-600">This is how your profile appears to employers after they request to view your details.</p>
      </div>

      {profile && <ProfileDetails profile={profile} />}
    </div>
  );
}

export default PreviewCandidateProfile;
