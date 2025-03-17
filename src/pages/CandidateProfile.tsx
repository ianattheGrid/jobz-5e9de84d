
import { CandidateForm } from "@/components/candidate/CandidateForm";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard } from "lucide-react";
import { FileUploadSection } from "@/components/candidate/FileUploadSection";

export default function CandidateProfile() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [cvUrl, setCvUrl] = useState<string | null>(null);

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

        // Fetch profile picture and CV URL
        const { data: profile, error } = await supabase
          .from('candidate_profiles')
          .select('profile_picture_url, cv_url')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setProfilePicture(profile.profile_picture_url);
          setCvUrl(profile.cv_url);
        }

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
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Update Your Profile</h1>
            <p className="text-primary text-sm">
              Keep your profile up to date to find the best job matches.
            </p>
          </div>
          <button
            onClick={() => navigate('/candidate/dashboard')}
            className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white bg-[#FF69B4] hover:bg-[#FF50A8]"
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Dashboard
          </button>
        </div>
        
        {userId && (
          <div className="mb-8 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Documents & Profile Picture</h2>
            <FileUploadSection 
              userId={userId} 
              currentProfilePicture={profilePicture} 
              currentCV={cvUrl}
            />
          </div>
        )}
        
        <div className="flex justify-center">
          <CandidateForm />
        </div>
      </div>
    </div>
  );
}
