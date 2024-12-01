import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import JobCard from "@/components/JobCard";
import { Database } from "@/integrations/supabase/types";

type Job = Database['public']['Tables']['jobs']['Row'];

const Jobs = () => {
  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Job[];
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Job Listings</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {jobs?.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default Jobs;