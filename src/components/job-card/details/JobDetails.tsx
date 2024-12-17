import { Job } from "@/integrations/supabase/types/jobs";
import { formatBenefits } from "../utils";

interface JobDetailsProps {
  job: Job;
}

const JobDetails = ({ job }: JobDetailsProps) => {
  return (
    <div className="space-y-4">
      <div className="text-sm">
        <h4 className="font-medium mb-2">Full Job Description</h4>
        <p className="text-muted-foreground whitespace-pre-line">
          {job.description}
        </p>
      </div>

      <div>
        <h4 className="font-medium mb-2">Benefits</h4>
        <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
          <li>Holiday Entitlement: {job.holiday_entitlement || 25} days</li>
          {formatBenefits(job.company_benefits).map((benefit, index) => (
            <li key={index}>{benefit}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default JobDetails;