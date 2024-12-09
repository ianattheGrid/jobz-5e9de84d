import { Database } from "@/integrations/supabase/types";
import { formatSalary } from "./utils";

type Job = Database['public']['Tables']['jobs']['Row'];

interface JobCardFrontProps {
  job: Job;
}

const JobCardFront = ({ job }: JobCardFrontProps) => {
  const calculateReferralCommission = (totalCommission: number) => {
    return Math.floor(totalCommission * 0.3);
  };

  return (
    <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm h-full">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold text-red-800">{job.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{job.company}</p>
        </div>
        <span className="text-sm font-medium px-3 py-1 bg-red-800/10 rounded-full">
          {job.type}
        </span>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {job.location}
        </div>

        <div className="text-sm">
          <span className="font-medium">Salary Range: </span>
          {formatSalary(job.salary_min)} - {formatSalary(job.salary_max)}
        </div>

        {job.candidate_commission && (
          <div className="space-y-2 p-3 bg-red-50 rounded-md">
            <p className="text-sm font-medium text-red-700">
              Commission Structure
            </p>
            <div className="text-sm text-red-600 space-y-1">
              <p>Total Commission: {formatSalary(job.candidate_commission)}</p>
              <div className="text-xs space-y-0.5">
                <p>• Candidate: {formatSalary(job.candidate_commission - calculateReferralCommission(job.candidate_commission))}</p>
                <p>• Referral: {formatSalary(calculateReferralCommission(job.candidate_commission))}</p>
              </div>
            </div>
          </div>
        )}

        <div className="pt-2">
          <p className="text-sm text-gray-600 line-clamp-3">
            {job.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobCardFront;