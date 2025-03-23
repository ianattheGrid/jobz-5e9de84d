
import { useParams, Link, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmployerProfileHeader } from "@/components/employer/public-profile/EmployerProfileHeader";
import { ProfileTabs } from "@/components/employer/public-profile/ProfileTabs";
import { RestrictedAccessMessage } from "@/components/employer/public-profile/RestrictedAccessMessage";
import { PreviewBanner } from "@/components/employer/public-profile/PreviewBanner";
import { useEmployerProfileView } from "@/hooks/useEmployerProfileView";

interface ViewEmployerProfileProps {
  previewMode?: boolean;
  employerId?: string;
}

const ViewEmployerProfile = ({ previewMode = false, employerId: propEmployerId }: ViewEmployerProfileProps) => {
  const { id: paramId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const id = propEmployerId || paramId;
  
  const { loading, profile, galleryImages, hasMatch } = useEmployerProfileView({
    employerId: id,
    previewMode
  });
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!profile) {
    return <RestrictedAccessMessage type="not-found" />;
  }
  
  if (!hasMatch && !previewMode) {
    return <RestrictedAccessMessage type="no-match" />;
  }
  
  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-start mb-6">
          {previewMode ? (
            <Button variant="outline" className="flex items-center gap-2 bg-white text-gray-700" onClick={() => navigate("/employer/profile")}>
              <ArrowLeft className="h-4 w-4" /> Back to Profile
            </Button>
          ) : (
            <Link to="/jobs">
              <Button variant="outline" className="flex items-center gap-2 bg-white text-gray-700">
                <ArrowLeft className="h-4 w-4" /> Back to Jobs
              </Button>
            </Link>
          )}
        </div>
        
        <PreviewBanner isVisible={previewMode} />
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <EmployerProfileHeader profile={profile} />
          <ProfileTabs profile={profile} galleryImages={galleryImages} />
        </div>
      </div>
    </div>
  );
}

export default ViewEmployerProfile;
