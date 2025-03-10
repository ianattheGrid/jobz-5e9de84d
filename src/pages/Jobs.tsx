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

const Jobs = () => {
  const { user, userType } = useAuth();
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
      
      return data as Job[];
    }
  });

  const handleSearch = (filters: JobSearchSchema) => {
    console.log('Applying search filters:', filters);
    setSearchFilters(filters);
  };

  return (
    <>
      <NavBar />
      <div className="container mx-auto py-8 px-4 bg-background min-h-screen">
        <JobsHeader userType={userType} jobCount={jobs?.length || 0} />
        <JobSearch onSearch={handleSearch} />
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center text-red-500">
            Failed to load jobs. Please try again later.
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
