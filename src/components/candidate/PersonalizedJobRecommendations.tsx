import { usePersonalizedJobs } from "@/hooks/usePersonalizedJobs";
import { PersonalizedJobCard } from "./PersonalizedJobCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Briefcase, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const PersonalizedJobRecommendations = () => {
  const { jobs, loading, profile } = usePersonalizedJobs();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/candidate/personalized-jobs');
  };

  if (loading) {
    return (
      <Button
        variant="outline"
        className="h-full min-h-[120px] flex flex-col items-center justify-center p-6 text-left hover:shadow-md transition-shadow"
        onClick={handleClick}
      >
        <TrendingUp className="h-8 w-8 text-[#FF69B4] mb-2" />
        <h3 className="font-semibold mb-1">Jobs Match</h3>
        <p className="text-sm text-gray-600 text-center">Loading matches...</p>
      </Button>
    );
  }

  if (!profile) {
    return (
      <Button
        variant="outline"
        className="h-full min-h-[120px] flex flex-col items-center justify-center p-6 text-left hover:shadow-md transition-shadow"
        onClick={() => navigate('/candidate/profile')}
      >
        <TrendingUp className="h-8 w-8 text-[#FF69B4] mb-2" />
        <h3 className="font-semibold mb-1">Jobs Match</h3>
        <p className="text-sm text-gray-600 text-center">Complete your profile to see matches</p>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      className="h-full min-h-[120px] flex flex-col items-center justify-center p-6 text-left hover:shadow-md transition-shadow"
      onClick={handleClick}
    >
      <TrendingUp className="h-8 w-8 text-[#FF69B4] mb-2" />
      <h3 className="font-semibold mb-1">Jobs Match</h3>
      <p className="text-sm text-gray-600 text-center">
        {jobs.length === 0 
          ? "No matches found - click to browse all jobs" 
          : `${jobs.length} job${jobs.length !== 1 ? 's' : ''} match your profile`
        }
      </p>
    </Button>
  );
};