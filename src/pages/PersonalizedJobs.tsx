import { usePersonalizedJobs } from "@/hooks/usePersonalizedJobs";
import { PersonalizedJobCard } from "@/components/candidate/PersonalizedJobCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Briefcase, TrendingUp, ArrowLeft } from "lucide-react";
import NavBar from "@/components/NavBar";

export const PersonalizedJobs = () => {
  const { jobs, loading, profile } = usePersonalizedJobs();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/candidate/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
          
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="h-6 w-6 text-[#FF69B4]" />
            <h1 className="text-2xl font-bold">Jobs Matching Your Profile</h1>
          </div>

          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-white rounded-lg border"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/candidate/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
          
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="h-6 w-6 text-[#FF69B4]" />
            <h1 className="text-2xl font-bold">Jobs Matching Your Profile</h1>
          </div>

          <div className="bg-white rounded-lg border p-8 text-center">
            <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Complete Your Profile First
            </h2>
            <p className="text-gray-600 mb-6">
              To see personalized job recommendations, please complete your profile with your skills, experience, and preferences.
            </p>
            <Button
              onClick={() => navigate('/candidate/profile')}
              className="bg-[#FF69B4] hover:bg-[#FF50A8] text-white"
            >
              Complete Profile
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/candidate/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
        
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="h-6 w-6 text-[#FF69B4]" />
          <h1 className="text-2xl font-bold">Jobs Matching Your Profile</h1>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white rounded-lg border p-8 text-center">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No Matches Found
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't find any jobs that match your current profile criteria. 
              You can browse all available positions or update your profile to see more matches.
            </p>
            <div className="flex gap-4 justify-center">
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
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                Found {jobs.length} job{jobs.length !== 1 ? 's' : ''} matching your profile
              </p>
              <Button
                variant="outline"
                onClick={() => navigate('/jobs')}
                className="flex items-center gap-2"
              >
                <Briefcase className="h-4 w-4" />
                Browse All Jobs
              </Button>
            </div>
            
            <div className="grid gap-6">
              {jobs.map((job) => (
                <PersonalizedJobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};