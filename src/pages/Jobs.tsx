import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/jobs/LoadingSpinner";
import EmptyJobsList from "@/components/jobs/EmptyJobsList";
import JobList from "@/components/jobs/JobList";
import JobsHeader from "@/components/jobs/JobsHeader";

type Job = Database['public']['Tables']['jobs']['Row'];

const Jobs = () => {
  const { user, userType } = useAuth();

  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      console.log('Fetching jobs...', { userType, userId: user?.id });
      
      let query = supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (user && userType === 'employer') {
        query = query.eq('employer_id', user.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching jobs:', error);
        throw error;
      }
      
      console.log('Fetched jobs:', data);
      return data as Job[];
    }
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-red-500">
          Failed to load jobs. Please try again later.
        </div>
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return <EmptyJobsList userType={userType} />;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <JobsHeader userType={userType} jobCount={jobs.length} />
      <JobList jobs={jobs} />
    </div>
  );
};

export default Jobs;