import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import JobCard from "@/components/JobCard";
import type { Database } from "@/integrations/supabase/types";

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

  const handleSwipe = (direction: "left" | "right", jobId: string) => {
    console.log(`Swiped ${direction} on job ${jobId}`);
    // TODO: Implement job application logic
  };

  if (isLoading) {
    return <div className="container py-8">Loading jobs...</div>;
  }

  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Available Jobs</h1>
      <div className="space-y-6">
        {jobs?.map((job) => (
          <JobCard
            key={job.id}
            title={job.title}
            company={job.company}
            location={job.location}
            description={job.description}
            salary={`$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`}
            type={job.type}
            candidateCommission={job.candidate_commission || undefined}
            referralCommission={job.referral_commission || undefined}
            onSwipe={(direction) => handleSwipe(direction, job.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Jobs;