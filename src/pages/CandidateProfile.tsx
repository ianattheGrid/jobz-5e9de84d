
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
import { CreateFromCVButton } from "@/components/candidate/CreateFromCVButton";
import { CandidateGallerySection } from "@/components/candidate/gallery/CandidateGallerySection";
import { SectionVisibilityToggles } from "@/components/candidate/SectionVisibilityToggles";
import { PersonalitySection } from "@/components/candidate/PersonalitySection";
import { PortfolioSection } from "@/components/candidate/portfolio/PortfolioSection";

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
    
    const initializeProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user?.id) {
          setUserId(session.user.id);
          await fetchProfileData(session.user.id);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error initializing profile:', error);
        setLoading(false);
      }
    };

    initializeProfile();
  }, []);

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

  // After CV prefill completed
  const handlePrefillComplete = async () => {
    if (userId) {
      await fetchProfileData(userId);
      toast({ title: "Profile prefilled from CV", description: "Review the fields and click Save." });
    }
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
      <div className="min-h-screen bg-background demo-candidate-dark">
        <div className="container mx-auto px-4 py-10">
          <Button
            onClick={togglePreview}
            className="mb-6 flex items-center gap-2"
            style={{ backgroundColor: '#FF69B4', color: 'white', border: 'none' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FF50A8'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF69B4'}
          >
            <ArrowLeft className="h-4 w-4" stroke="white" fill="none" strokeWidth={2} />
            Back to Editing
          </Button>

          <div className="bg-pink-100 border-l-4 border-pink-500 p-4 mb-6 preview-mode-text">
            <p className="font-medium text-slate-800">Preview Mode</p>
            <p className="text-sm text-slate-700">This is how your profile appears to employers after they request to view your details.</p>
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
              className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium"
              style={{ backgroundColor: '#FF69B4', color: 'white' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FF50A8'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF69B4'}
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </button>
          </div>
        </div>
        
        <div className="mb-8 max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Documents & Profile Picture</h2>
          {userId && (
            <div className="space-y-8">
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <FileUploadSection 
                  userId={userId} 
                  currentProfilePicture={profilePicture} 
                  currentCV={cvUrl}
                  onUploadComplete={handleFileUploadComplete}
                />
                <div className="mt-4">
                  <CreateFromCVButton 
                    cvUrl={cvUrl}
                    userId={userId}
                    onComplete={handlePrefillComplete}
                  />
                </div>
              </div>

              {/* Candidate Gallery */}
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Gallery</h2>
                  {userId && <CandidateGallerySection candidateId={userId} />}
                </div>
              </div>

              {/* Portfolio Section */}
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                {userId && <PortfolioSection userId={userId} />}
              </div>

              {/* Visibility toggles */}
              <SectionVisibilityToggles 
                userId={userId}
                initial={(profileData as any)?.visible_sections || null}
                onChange={(next) => setProfileData(prev => ({ ...(prev as any), visible_sections: next }) as any)}
              />

              <VerificationSection />
            </div>
          )}
        </div>
        
        <div className="flex justify-center">
          <CandidateForm />
        </div>
        
        {/* Personality Questions - moved to bottom */}
        {userId && (
          <div className="container mx-auto px-4 pb-10 max-w-3xl">
            <PersonalitySection 
              userId={userId}
              initialItems={(profileData as any)?.personality || null}
              onSaved={(items) => setProfileData(prev => ({ ...(prev as any), personality: items }) as any)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
