
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ProfileDetails from "@/components/candidate-profile/ProfileDetails";
import { CandidateProfile } from "@/integrations/supabase/types/profiles";
import { useToast } from "@/hooks/use-toast";

function PreviewCandidateProfile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function checkSession() {
      try {
        setLoading(true);
        
        // Get current session
        const { data } = await supabase.auth.getSession();
        const session = data.session;
        
        if (!session) {
          // No authentication required to view preview
          // Just display a message asking to sign in
          setError("Sign in to view your profile preview");
          setLoading(false);
          return;
        }

        setUserId(session.user.id);
        
        // Fetch the candidate profile data
        const { data: profileData, error: profileError } = await supabase
          .from('candidate_profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          setError("Could not load profile data");
          setLoading(false);
          return;
        }

        if (!profileData) {
          setError("Please complete your profile first");
          setLoading(false);
          return;
        }

        // Set profile data
        setProfile(profileData as unknown as CandidateProfile);
        setLoading(false);
        
      } catch (err) {
        console.error("Error in preview:", err);
        setError("An unexpected error occurred");
        setLoading(false);
      }
    }

    checkSession();
  }, []);

  // Handle go back button
  const handleGoBack = () => {
    if (userId) {
      navigate('/candidate/profile');
    } else {
      navigate('/');
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
        
        {!userId && (
          <Button 
            variant="default"
            onClick={() => navigate('/candidate/signin')}
            className="bg-pink-600 hover:bg-pink-700"
          >
            Sign in as Candidate
          </Button>
        )}
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
        {userId ? "Back to Profile" : "Back to Home"}
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
