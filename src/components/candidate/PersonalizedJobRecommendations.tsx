import { usePersonalizedJobs } from "@/hooks/usePersonalizedJobs";
import { PersonalizedJobCard } from "./PersonalizedJobCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Briefcase, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const PersonalizedJobRecommendations = () => {
  const { jobs, loading, profile } = usePersonalizedJobs();
  const navigate = useNavigate();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#FF69B4]" />
            Jobs Matching Your Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#FF69B4]" />
            Jobs Matching Your Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-gray-600 mb-4">
            Complete your profile to see personalized job recommendations.
          </p>
          <Button
            onClick={() => navigate('/candidate/profile')}
            className="bg-[#FF69B4] hover:bg-[#FF50A8] text-white"
          >
            Update Profile
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#FF69B4]" />
            Jobs Matching Your Profile
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/jobs')}
            className="flex items-center gap-2"
          >
            <Briefcase className="h-4 w-4" />
            View All Jobs
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {jobs.length === 0 ? (
          <div className="text-center py-8">
            <div className="mb-4">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No vacancies currently matching your profile
            </h3>
            <p className="text-gray-600 mb-4">
              We couldn't find any jobs that match your current profile criteria. 
              You can browse all available positions or update your profile to see more matches.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => navigate('/jobs')}
                className="bg-[#FF69B4] hover:bg-[#FF50A8] text-white"
              >
                Browse All Jobs
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/candidate/profile')}
              >
                Update Profile
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              Found {jobs.length} job{jobs.length !== 1 ? 's' : ''} matching your profile
            </div>
            <div className="grid gap-4">
              {jobs.map((job) => (
                <PersonalizedJobCard key={job.id} job={job} />
              ))}
            </div>
            {jobs.length >= 6 && (
              <div className="text-center pt-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/jobs')}
                  className="flex items-center gap-2"
                >
                  <Briefcase className="h-4 w-4" />
                  View More Jobs
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};