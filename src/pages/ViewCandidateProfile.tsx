
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { LoadingState } from "@/components/candidate-search/LoadingState";
import { useCandidateProfileData } from "@/hooks/useCandidateProfileData";
import ProfileDetails from "@/components/candidate-profile/ProfileDetails";

function ViewCandidateProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile, loading } = useCandidateProfileData(id);

  if (loading) {
    return <LoadingState />;
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-500">Profile not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Search
      </Button>

      <ProfileDetails profile={profile} />
    </div>
  );
}

export default ViewCandidateProfile;
