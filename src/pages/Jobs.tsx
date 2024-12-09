import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import JobCard from "@/components/JobCard";
import { Database } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

type Job = Database['public']['Tables']['jobs']['Row'];

const Jobs = () => {
  const { user, userType } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ['jobs', user?.id],
    queryFn: async () => {
      console.log('Fetching jobs...');
      
      // If user is not an employer, show all jobs
      if (userType !== 'employer') {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching jobs:', error);
          throw error;
        }
        
        console.log('Fetched all jobs:', data);
        return data as Job[];
      }

      // For employers, only show their jobs
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('employer_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching employer jobs:', error);
        throw error;
      }
      
      console.log('Fetched employer jobs:', data);
      return data as Job[];
    },
    enabled: !!user, // Only run query if user is authenticated
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
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
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-gray-500">
          {userType === 'employer' ? (
            <div className="space-y-4">
              <p>You haven't posted any jobs yet.</p>
              <button
                onClick={() => navigate('/employer/create-vacancy')}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Post Your First Job
              </button>
            </div>
          ) : (
            "No jobs available at the moment."
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {userType === 'employer' ? 'Your Job Postings' : 'Available Positions'} ({jobs.length})
        </h1>
        {userType === 'employer' && (
          <button
            onClick={() => navigate('/employer/create-vacancy')}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Post New Job
          </button>
        )}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default Jobs;