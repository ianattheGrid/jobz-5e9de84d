import { CandidateForm } from "@/components/candidate/CandidateForm";
import { FileUploadSection } from "@/components/candidate/FileUploadSection";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function CandidateProfile() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<{ profile_picture_url: string | null; cv_url: string | null; } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "Please sign in as a candidate to update your profile.",
          });
          navigate('/');
          return;
        }

        const userType = session.user.user_metadata.user_type;
        if (userType !== 'candidate') {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "Only candidates can access this page.",
          });
          navigate('/');
          return;
        }

        setUserId(session.user.id);

        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('candidate_profiles')
          .select('profile_picture_url, cv_url')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          throw profileError;
        }

        setProfile(profileData || { profile_picture_url: null, cv_url: null });
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "An error occurred while loading your profile.",
        });
      }
    };

    checkAuth();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-800"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4 text-black text-left">Update Your Profile</h1>
      <p className="text-[#ea384c] mb-8 text-sm text-left">
        Keep your profile up to date to find the best job matches.
      </p>
      {userId && profile && (
        <div className="space-y-8">
          <FileUploadSection
            userId={userId}
            currentProfilePicture={profile.profile_picture_url}
            currentCV={profile.cv_url}
          />
          <div className="flex justify-center">
            <CandidateForm />
          </div>
        </div>
      )}
    </div>
  );
}