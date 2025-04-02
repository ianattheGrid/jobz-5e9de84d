
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ProfileDetails from "@/components/candidate-profile/ProfileDetails";
import { CandidateProfile } from "@/integrations/supabase/types/profiles";
import { useToast } from "@/components/ui/use-toast";
import { signOut } from "@/utils/auth/signOut";
import { fetchUserRole } from "@/utils/auth/fetchUserRole";

function PreviewCandidateProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [authStatus, setAuthStatus] = useState<'loading' | 'authenticated' | 'unauthenticated' | 'wrong-role'>('loading');
  const [userRole, setUserRole] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuthAndFetchProfile = async () => {
      try {
        setLoading(true);
        
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("No session found in profile preview");
          setAuthStatus('unauthenticated');
          return;
        }

        // Get the user's role
        try {
          const userRoleData = await fetchUserRole(session.user.id);
          
          if (!userRoleData || userRoleData.role !== 'candidate') {
            console.log("User is not a candidate:", userRoleData?.role);
            setUserRole(userRoleData?.role || null);
            setAuthStatus('wrong-role');
            return;
          }
          
          setUserRole('candidate');
        } catch (roleError) {
          console.error('Error fetching user role:', roleError);
          setAuthStatus('unauthenticated');
          return;
        }

        // Fetch the candidate's profile data (only if they're a candidate)
        const { data, error } = await supabase
          .from('candidate_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not load your profile data. Please try again later.",
          });
          setAuthStatus('authenticated'); // They're authenticated but we couldn't load profile
          return;
        }

        if (!data) {
          toast({
            variant: "destructive",
            title: "Profile Not Found",
            description: "Please complete your profile first.",
          });
          setAuthStatus('authenticated'); // They're authenticated but no profile exists
          return;
        }
        
        console.log("Fetched candidate profile data:", data);
        
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
        setAuthStatus('authenticated');
      } catch (error) {
        console.error('Unexpected error:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "An unexpected error occurred. Please try again later.",
        });
        setAuthStatus('unauthenticated');
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

  const handleSignIn = () => {
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

  // Show unauthenticated state
  if (authStatus === 'unauthenticated') {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 max-w-xl w-full">
          <p className="font-bold">Access Denied</p>
          <p>You need to be signed in as a candidate to view your profile preview.</p>
        </div>
        
        <Button 
          onClick={handleSignIn}
          variant="default" 
          className="bg-pink-600 hover:bg-pink-700 text-white"
        >
          Sign in as Candidate
        </Button>
      </div>
    );
  }

  // Show wrong role state
  if (authStatus === 'wrong-role') {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 max-w-xl w-full">
          <p className="font-bold">Access Denied</p>
          <p>This page is only for candidate accounts. You are currently signed in as: {userRole || 'unknown role'}.</p>
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

  // Show empty profile state (authenticated but no profile)
  if (authStatus === 'authenticated' && !profile) {
    return (
      <div className="container mx-auto px-4 py-8 bg-white">
        <Button
          variant="outline"
          onClick={() => navigate('/candidate/dashboard')}
          className="mb-6 flex items-center gap-2 bg-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You need to complete your profile first before previewing it.</p>
          <Button onClick={() => navigate('/candidate/profile')} className="bg-pink-600 hover:bg-pink-700">
            Complete Your Profile
          </Button>
        </div>
      </div>
    );
  }

  // Show profile preview (authenticated with profile)
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

      {profile && <ProfileDetails profile={profile} />}
    </div>
  );
}

export default PreviewCandidateProfile;
