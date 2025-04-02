
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ProfileDetails from "@/components/candidate-profile/ProfileDetails";
import { CandidateProfile } from "@/integrations/supabase/types/profiles";
import { useToast } from "@/components/ui/use-toast";
import { signOut } from "@/utils/auth/signOut";

function PreviewCandidateProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuthAndFetchProfile = async () => {
      try {
        setLoading(true);
        
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("No session found in profile preview");
          setAuthError("Please sign in to view your profile preview");
          return;
        }

        // Get the user's role specifically
        const { data: userRole, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        if (roleError || !userRole) {
          console.error('Error fetching role:', roleError);
          setAuthError("Could not verify your account type. Please sign in again.");
          return;
        }

        // Only allow candidate users to access this page
        if (userRole.role !== 'candidate') {
          console.log('User is not a candidate:', userRole.role);
          setAuthError("This page is only accessible to candidate accounts");
          
          // We don't sign out automatically here to avoid disrupting their experience
          // They may want to navigate elsewhere with their current account
          return;
        }

        // Fetch the candidate's profile data
        const { data, error } = await supabase
          .from('candidate_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          setAuthError("Could not load your profile data. Please try again.");
          return;
        }

        if (!data) {
          setAuthError("Profile not found. Please complete your profile first.");
          return;
        }
        
        console.log("Fetched profile data:", data);
        
        // Transform the data to match CandidateProfile type
        const candidateProfile: CandidateProfile = {
          id: data.id,
          email: data.email,
          job_title: data.job_title,
          years_experience: data.years_experience,
          location: data.location || [],
          min_salary: data.min_salary,
          max_salary: data.max_salary,
          required_qualifications: data.required_qualifications || [],
          required_skills: data.required_skills || null,
          security_clearance: data.security_clearance,
          commission_percentage: data.commission_percentage,
          created_at: data.created_at,
          updated_at: data.updated_at,
          signup_date: data.signup_date,
          work_eligibility: data.work_eligibility,
          preferred_work_type: data.preferred_work_type,
          availability: data.availability,
          additional_skills: data.additional_skills,
          address: data.address,
          ai_synopsis: data.ai_synopsis,
          ai_synopsis_last_updated: data.ai_synopsis_last_updated,
          ai_synopsis_status: data.ai_synopsis_status,
          current_employer: data.current_employer,
          cv_url: data.cv_url,
          full_name: data.full_name,
          phone_number: data.phone_number,
          profile_picture_url: data.profile_picture_url,
          travel_radius: data.travel_radius,
          work_preferences: data.work_preferences,
          desired_job_title: data.desired_job_title,
          home_postcode: data.home_postcode,
          linkedin_url: data.linkedin_url,
          years_in_current_title: data.years_in_current_title || null,
          workArea: data.workArea || null,
          itSpecialization: data.itSpecialization || null
        };
        
        setProfile(candidateProfile);
        setAuthError(null);

      } catch (error) {
        console.error('Unexpected error:', error);
        setAuthError("An unexpected error occurred. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchProfile();
  }, [navigate, toast]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/candidate/signin');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <span className="text-gray-700">Loading your profile preview...</span>
      </div>
    );
  }

  // Show auth error
  if (authError) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 max-w-xl w-full">
          <p className="font-bold">Access Denied</p>
          <p>{authError}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={() => navigate('/candidate/signin')} 
            variant="default" 
            className="bg-pink-600 hover:bg-pink-700 text-white"
          >
            Sign in as Candidate
          </Button>
          
          <Button 
            onClick={handleSignOut} 
            variant="outline"
          >
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  // Show empty profile state
  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8 bg-white">
        <p className="text-gray-500">Profile not found. Please complete your profile first.</p>
        <Button onClick={() => navigate('/candidate/profile')} className="mt-4 bg-pink-600 hover:bg-pink-700">
          Go to Profile
        </Button>
      </div>
    );
  }

  // Show profile preview
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl bg-gray-50 min-h-screen">
      <Button
        variant="outline"
        onClick={() => navigate('/candidate/profile')}
        className="mb-6 flex items-center gap-2 bg-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Profile
      </Button>

      <div className="bg-pink-100 border-l-4 border-pink-500 p-4 mb-6 rounded-md">
        <p className="text-pink-700 font-medium">Preview Mode</p>
        <p className="text-sm text-pink-600">This is how your profile appears to employers after they request to view your details.</p>
      </div>

      <ProfileDetails profile={profile} />
    </div>
  );
}

export default PreviewCandidateProfile;
