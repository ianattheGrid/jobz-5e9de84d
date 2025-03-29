
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Job } from "@/integrations/supabase/types/jobs";
import { useAuth } from "@/hooks/useAuth";
import NavBar from "@/components/NavBar";
import LoadingSpinner from "@/components/jobs/LoadingSpinner";
import EmptyJobsList from "@/components/jobs/EmptyJobsList";
import JobList from "@/components/jobs/JobList";
import JobsHeader from "@/components/jobs/JobsHeader";
import JobSearch from "@/components/jobs/JobSearch";
import { useState } from "react";
import { JobSearchSchema } from "@/components/jobs/JobSearchSchema";
import { bristolPostcodes } from "@/data/bristolPostcodes";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";

const Jobs = () => {
  const { user, userType } = useAuth();
  const navigate = useNavigate();
  const [searchFilters, setSearchFilters] = useState<JobSearchSchema | null>(null);

  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ['jobs', searchFilters],
    queryFn: async () => {
      console.log('Fetching jobs...', { userType, userId: user?.id, searchFilters });
      
      let query = supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (user && userType === 'employer') {
        query = query.eq('employer_id', user.id);
      }

      if (searchFilters) {
        if (searchFilters.workArea) {
          query = query.eq('work_area', searchFilters.workArea);
        }

        if (searchFilters.specialization) {
          query = query.eq('specialization', searchFilters.specialization);
        }

        if (searchFilters.title) {
          query = query.ilike('title', `%${searchFilters.title}%`);
        }

        if (searchFilters.location && searchFilters.location.length > 0) {
          if (searchFilters.location.length === bristolPostcodes.length) {
            // If all locations are selected, don't filter by location
          } else {
            query = query.in('location', searchFilters.location);
          }
        }

        if (searchFilters.hasCommission) {
          query = query.not('candidate_commission', 'is', null).gt('candidate_commission', 0);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching jobs:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        return [];
      }
      
      const transformedData: Job[] = data.map(job => ({
        ...job as Omit<Job, 'match_threshold' | 'required_skills'>,
        match_threshold: (job as any).match_threshold || 60,
        required_skills: (job as any).required_skills || []
      }));
      
      return transformedData;
    },
    // Set a longer staleTime to prevent immediate refetching
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Set a retry policy for network errors
    retry: 2,
    retryDelay: 1000,
  });

  const handleSearch = (filters: JobSearchSchema) => {
    console.log('Applying search filters:', filters);
    setSearchFilters(filters);
  };

  return (
    <>
      <NavBar />
      <div className="container mx-auto py-8 px-4 bg-background min-h-screen">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <JobsHeader userType={userType} />
            {userType === 'candidate' && (
              <Button
                onClick={() => navigate('/candidate/dashboard')}
                className="text-white mt-12"
                variant="default"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            )}
          </div>
        </div>
        <JobSearch onSearch={handleSearch} />
        
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center text-red-500 mt-8">
            <p>Failed to load jobs. Please try again later.</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline" 
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        ) : !jobs || jobs.length === 0 ? (
          <EmptyJobsList userType={userType} />
        ) : (
          <JobList jobs={jobs} />
        )}
      </div>
    </>
  );
};

export default Jobs;
