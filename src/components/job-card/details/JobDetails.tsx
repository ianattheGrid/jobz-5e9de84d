
import { Job } from "@/integrations/supabase/types/jobs";
import { formatBenefits } from "../utils";

interface JobDetailsProps {
  job: Job;
}

const JobDetails = ({ job }: JobDetailsProps) => {
  return (
    <div className="space-y-4 bg-white p-6 rounded-lg">
      <div className="text-sm">
        <h4 className="font-semibold mb-2 text-gray-900">Full Job Description</h4>
        <p className="text-gray-700 whitespace-pre-line">
          {job.description}
        </p>
      </div>

      <div>
        <h4 className="font-semibold mb-2 text-gray-900">Benefits</h4>
        <ul className="text-sm text-gray-700 list-disc pl-4 space-y-1">
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
