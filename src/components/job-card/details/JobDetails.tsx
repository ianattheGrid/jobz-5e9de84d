
import { Job } from "@/integrations/supabase/types/jobs";
import { formatBenefits } from "../utils";
import { GraduationCap, Clock, ListChecks, Briefcase } from "lucide-react";

interface JobDetailsProps {
  job: Job;
}

const JobDetails = ({ job }: JobDetailsProps) => {
  return (
    <div className="space-y-6 bg-white p-6 rounded-lg">
      <div className="text-sm">
        <h4 className="font-semibold text-lg mb-3 text-gray-900">Full Job Description</h4>
        <p className="text-gray-700 whitespace-pre-line leading-relaxed">
          {job.description}
        </p>
      </div>

      {job.required_skills && job.required_skills.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2 text-gray-900 flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-primary" />
            Required Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {job.required_skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {job.required_qualifications && (
        <div>
          <h4 className="font-semibold mb-2 text-gray-900 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Required Qualifications
          </h4>
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            {job.required_qualifications.map((qual, index) => (
              <li key={index}>{qual}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h4 className="font-semibold mb-2 text-gray-900 flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          Benefits & Perks
        </h4>
        <ul className="text-sm text-gray-700 space-y-2">
          <li className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Holiday Entitlement: {job.holiday_entitlement || 25} days
          </li>
          {formatBenefits(job.company_benefits).map((benefit, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="w-1 h-1 bg-primary rounded-full" />
              {benefit}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default JobDetails;
