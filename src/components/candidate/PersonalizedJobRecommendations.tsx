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
      <div className="bg-white p-6 rounded-lg border hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-[#FF69B4]" />
          <h3 className="font-medium">Jobs Matching Your Profile</h3>
        </div>
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-white p-6 rounded-lg border hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-[#FF69B4]" />
          <h3 className="font-medium">Jobs Matching Your Profile</h3>
        </div>
        <p className="text-gray-600 text-sm mb-4">
          Complete your profile to see personalized job recommendations.
        </p>
        <Button
          onClick={() => navigate('/candidate/profile')}
          className="bg-[#FF69B4] hover:bg-[#FF50A8] text-white w-full"
          size="sm"
        >
          Update Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-[#FF69B4]" />
          <h3 className="font-medium">Jobs Matching Your Profile</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/jobs')}
          className="text-xs"
        >
          View All
        </Button>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-4">
          <Briefcase className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-3">
            No vacancies currently matching your profile
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => navigate('/jobs')}
              className="bg-[#FF69B4] hover:bg-[#FF50A8] text-white flex-1"
              size="sm"
            >
              Browse All Jobs
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/candidate/profile')}
              size="sm"
              className="flex-1"
            >
              Update Profile
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            {jobs.length} job{jobs.length !== 1 ? 's' : ''} found
          </p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {jobs.slice(0, 3).map((job) => (
              <div
                key={job.id}
                className="p-3 border rounded hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/jobs/${job.id}`)}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-sm truncate">{job.title}</h4>
                  {job.matchScore && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      {Math.round(job.matchScore)}% match
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 truncate">{job.company}</p>
                <p className="text-xs text-gray-500">{job.location}</p>
              </div>
            ))}
          </div>
          {jobs.length > 3 && (
            <Button
              variant="outline"
              onClick={() => navigate('/jobs')}
              className="w-full"
              size="sm"
            >
              View {jobs.length - 3} More Jobs
            </Button>
          )}
        </div>
      )}
    </div>
  );
};