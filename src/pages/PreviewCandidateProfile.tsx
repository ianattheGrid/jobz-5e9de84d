
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, RefreshCw } from "lucide-react";
import { LoadingState } from "@/components/candidate-search/LoadingState";
import { supabase } from "@/integrations/supabase/client";
import ProfileDetails from "@/components/candidate-profile/ProfileDetails";
import { CandidateProfile } from "@/integrations/supabase/types/profiles";
import { useToast } from "@/components/ui/use-toast";

function PreviewCandidateProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const { toast } = useToast();

  // Function to fetch profile data
  const fetchProfile = async () => {
    setLoading(true);
    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You must be logged in to view your profile preview.",
        });
        navigate('/candidate/signin');
        return;
      }

      // Check if user is a candidate
      if (session.user.user_metadata.user_type !== 'candidate') {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "Only candidates can access this page.",
        });
        navigate('/');
        return;
      }

      // Fetch the candidate's profile with fresh data
      const { data, error } = await supabase
        .from('candidate_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }

      if (data) {
        console.log("Fetched profile data:", data);
        setProfile(data as CandidateProfile);
      } else {
        toast({
          variant: "destructive",
          title: "Profile Not Found",
          description: "Please complete your profile first.",
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load your profile. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [navigate, toast]);

  const handleRefresh = () => {
    fetchProfile();
    toast({
      title: "Refreshing",
      description: "Updating your profile preview with the latest data."
    });
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-500">Profile not found. Please complete your profile first.</p>
        <Button onClick={() => navigate('/candidate/profile')} className="mt-4">
          Go to Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/candidate/profile')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Profile
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full border border-amber-200 text-sm">
            Profile Preview Mode
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            className="flex items-center gap-2 text-sm"
            size="sm"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/candidate/profile')}
            className="flex items-center gap-2 text-sm"
            size="sm"
          >
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md flex items-start">
          <div className="flex-shrink-0 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p>This is how employers will see your profile when you match with their job listings.</p>
          </div>
        </div>
      </div>

      <ProfileDetails profile={profile} />
    </div>
  );
}

export default PreviewCandidateProfile;
