import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Job = Database["public"]["Tables"]["jobs"]["Row"];

const Jobs = () => {
  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Job[];
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading jobs</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Jobs</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs?.map((job) => (
          <div
            key={job.id}
            className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
            <p className="text-gray-600 mb-2">{job.company}</p>
            <p className="text-gray-500 mb-4">{job.location}</p>
            <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>
            <div className="text-sm text-gray-600">
              <p>
                Salary: ${job.salary_min.toLocaleString()} - $
                {job.salary_max.toLocaleString()}
              </p>
              <p className="mt-1">Type: {job.type}</p>
              {job.candidate_commission && (
                <p className="mt-1">Bonus: {job.candidate_commission}</p>
              )}
              {job.referral_commission && (
                <p className="mt-1">Referral: {job.referral_commission}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Jobs;