
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
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
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .maybeSingle();
        
      if (!userRole || userRole.role !== 'candidate') {
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

  if (loading) {
    return <LoadingState />;
  }

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

      <ProfileDetails profile={profile} />
    </div>
  );
}

export default PreviewCandidateProfile;
