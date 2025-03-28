
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { RecommendationForms } from "@/components/recommendations/RecommendationForms";
import { ChevronLeft } from "lucide-react";

const VirtualRecruiterRecommendations = () => {
  const navigate = useNavigate();
  
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
      <RecommendationForms />
    </div>
  );
};

export default VirtualRecruiterRecommendations;
