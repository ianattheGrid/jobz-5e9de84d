
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { LoadingState } from "@/components/candidate-search/LoadingState";
import { useCandidateProfileData } from "@/hooks/useCandidateProfileData";
import ProfileDetails from "@/components/candidate-profile/ProfileDetails";
import { VRRecommendationBadge } from "@/components/recommendations/VRRecommendationBadge";

function ViewCandidateProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile, loading, vrRecommendation, notShared } = useCandidateProfileData(id);

  if (loading) {
    return <LoadingState />;
  }

  if (notShared) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl bg-background min-h-screen">
        <h1 className="text-2xl font-semibold mb-3">This person hasn't shared their details yet</h1>
        <p className="text-muted-foreground">
          On Jobz, people stay anonymous until they agree to share. Go back to your matches and use
          "Ask to see full profile" — they'll get your message and decide.
        </p>
        <Button variant="outline" onClick={() => navigate(-1)} className="mt-6">
          Go Back
        </Button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8 bg-background">
        <p className="text-gray-500">Profile not found.</p>
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="mt-4"
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl bg-background min-h-screen demo-candidate-dark">
      <Button
        variant="outline"
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      {vrRecommendation && <VRRecommendationBadge recommendation={vrRecommendation} className="mb-6" />}
      
      <ProfileDetails profile={profile} />
    </div>
  );
}

export default ViewCandidateProfile;
