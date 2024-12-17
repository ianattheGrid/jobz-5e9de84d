import JobCard from "@/components/JobCard";
import { Job } from "@/integrations/supabase/types/jobs";

interface JobListProps {
  jobs: Job[];
}

const JobList = ({ jobs }: JobListProps) => {
  return (
    <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      {jobs.map((job) => (
        <div key={job.id} className="h-full">
          <JobCard job={job} />
        </div>
      ))}
    </div>
  );
};

export default JobList;