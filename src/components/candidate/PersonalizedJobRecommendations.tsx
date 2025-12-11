import { usePersonalizedJobs } from "@/hooks/usePersonalizedJobs";
import { useNavigate } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { DashboardCard } from "@/components/ui/dashboard-card";

export const PersonalizedJobRecommendations = () => {
  const { jobs, loading, profile } = usePersonalizedJobs();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/candidate/personalized-jobs');
  };

  const getMessage = () => {
    if (loading) {
      return "View your profile job matches";
    }
    if (!profile) {
      return "Complete your profile to see matches";
    }
    if (jobs.length === 0) {
      return "No matches found - click to browse all jobs";
    }
    return `${jobs.length} job${jobs.length !== 1 ? 's' : ''} match your profile`;
  };

  return (
    <DashboardCard
      onClick={!profile && !loading ? () => navigate('/candidate/profile') : handleClick}
      helpTitle="Jobs Match"
      helpText="See job vacancies that match your profile. The more complete your profile, the better your matches will be!"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <TrendingUp className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2 text-foreground">Jobs Match</h3>
          <p className="text-sm text-muted-foreground">{getMessage()}</p>
        </div>
      </div>
    </DashboardCard>
  );
};
