
import { CandidateForm } from "@/components/candidate/CandidateForm";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, ArrowLeft } from "lucide-react";
import { FileUploadSection } from "@/components/candidate/FileUploadSection";
import { PreviewButton } from "@/components/candidate/PreviewButton";
import { initializeStorage } from "@/integrations/supabase/storage";
import { VerificationSection } from "@/components/candidate/VerificationSection";
import { Button } from "@/components/ui/button";
import ProfileDetails from "@/components/candidate-profile/ProfileDetails";
import { CandidateProfile as ProfileType } from "@/integrations/supabase/types/profiles";

export default function CandidateProfile() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [profileData, setProfileData] = useState<ProfileType | null>(null);

  // Function to fetch profile data
  const fetchProfileData = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('candidate_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      
      if (profile) {
        setProfilePicture(profile.profile_picture_url);
        setCvUrl(profile.cv_url);
        setProfileData(profile as unknown as ProfileType);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    // Initialize storage buckets
    initializeStorage().catch(console.error);
    
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
        await fetchProfileData(session.user.id);

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

  // Handler for file upload completion
  const handleFileUploadComplete = async () => {
    if (userId) {
      await fetchProfileData(userId);
      toast({
        title: "Success",
        description: "File uploaded successfully."
      });
    }
  };

  // Toggle preview mode
  const togglePreview = () => {
    setShowPreview(prev => !prev);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (showPreview && profileData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-10">
          <Button
            variant="outline"
            onClick={togglePreview}
            className="mb-6 flex items-center gap-2 bg-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Editing
          </Button>

          <div className="bg-pink-100 border-l-4 border-pink-500 p-4 mb-6">
            <p className="text-pink-700 font-medium">Preview Mode</p>
            <p className="text-sm text-pink-600">This is how your profile appears to employers after they request to view your details.</p>
          </div>

          {profileData && <ProfileDetails profile={profileData} />}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-auto">
      <div className="container mx-auto px-4 py-10 pb-20">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Update Your Profile</h1>
            <p className="text-primary text-sm">
              Keep your profile up to date to find the best job matches.
            </p>
          </div>
          <div className="flex space-x-2">
            <PreviewButton onPreviewClick={togglePreview} />
            <button
              onClick={() => navigate('/candidate/dashboard')}
              className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white bg-[#FF69B4] hover:bg-[#FF50A8]"
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </button>
          </div>
        </div>
        
        <div className="mb-8 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Documents & Profile Picture</h2>
          {userId && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <FileUploadSection 
                  userId={userId} 
                  currentProfilePicture={profilePicture} 
                  currentCV={cvUrl}
                  onUploadComplete={handleFileUploadComplete}
                />
              </div>
              
              <VerificationSection />
            </div>
          )}
        </div>
        
        <div className="flex justify-center">
          <CandidateForm />
        </div>
      </div>
    </div>
  );
}
