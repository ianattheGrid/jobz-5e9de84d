import { Database } from "@/integrations/supabase/types";

type Job = Database['public']['Tables']['jobs']['Row'];

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
  return (
    <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{job.title}</h3>
        <span className="text-sm text-muted-foreground">{job.type}</span>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{job.company}</p>
        <p className="text-sm text-muted-foreground">{job.location}</p>
        <p className="text-sm">
          £{job.salary_min.toLocaleString()} - £{job.salary_max.toLocaleString()}
        </p>
        {job.candidate_commission && (
          <p className="text-sm text-green-600">
            £{job.candidate_commission.toLocaleString()} commission
          </p>
        )}
      </div>
    </div>
  );
};

export default JobCard;