
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { RecommendationForms } from "@/components/recommendations/RecommendationForms";
import { ChevronLeft } from "lucide-react";

const VirtualRecruiterRecommendations = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract the type parameter from the URL query string
  const queryParams = new URLSearchParams(location.search);
  const recommendationType = queryParams.get('type');
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => navigate('/vr/dashboard')}
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
      <RecommendationForms defaultTab={recommendationType === 'job' ? 'job-specific' : 'general'} />
    </div>
  );
};

export default VirtualRecruiterRecommendations;
