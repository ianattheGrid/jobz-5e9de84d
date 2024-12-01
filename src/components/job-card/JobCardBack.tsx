import { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { formatBenefits } from "./utils";

type Job = Database['public']['Tables']['jobs']['Row'];

interface JobCardBackProps {
  job: Job;
}

const JobCardBack = ({ job }: JobCardBackProps) => {
  return (
    <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm h-full overflow-y-auto">
      <h3 className="text-xl font-semibold text-primary mb-4">{job.title}</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Full Description</h4>
          <p className="text-sm text-gray-600 whitespace-pre-line">
            {job.description}
          </p>
        </div>

        <div>
          <h4 className="font-medium mb-2">Benefits</h4>
          <ul className="text-sm text-gray-600 list-disc pl-4 space-y-1">
            <li>Holiday Entitlement: {job.holiday_entitlement || 25} days</li>
            {formatBenefits(job.company_benefits).map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-2">How to Apply</h4>
          <p className="text-sm text-gray-600">
            To apply for this position, please click the button below:
          </p>
          <Button 
            className="mt-2 w-full"
            onClick={(e) => {
              e.stopPropagation();
              // Add application logic here
            }}
          >
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobCardBack;