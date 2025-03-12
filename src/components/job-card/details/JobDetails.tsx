
import { Job } from "@/integrations/supabase/types/jobs";
import { formatBenefits } from "../utils";
import { GraduationCap, Clock, ListChecks, Briefcase, Target, Building2 } from "lucide-react";

interface JobDetailsProps {
  job: Job;
}

const JobDetails = ({ job }: JobDetailsProps) => {
  return (
    <div className="space-y-6 bg-white p-6 rounded-lg">
      {/* Full Description */}
      <div className="text-sm">
        <h4 className="font-semibold text-lg mb-3 text-gray-900">About This Role</h4>
        <div className="space-y-4 text-gray-700">
          <p className="whitespace-pre-line leading-relaxed">
            {job.description}
          </p>
          
          <div className="flex items-center gap-2 mt-4 text-primary">
            <Building2 className="h-5 w-5" />
            <span className="font-medium">Work Area: {job.work_area}</span>
          </div>
          
          {job.specialization && (
            <div className="flex items-center gap-2 text-primary">
              <Target className="h-5 w-5" />
              <span className="font-medium">Specialization: {job.specialization}</span>
            </div>
          )}
        </div>
      </div>

      {/* Required Skills */}
      {job.required_skills && job.required_skills.length > 0 && (
        <div>
          <h4 className="font-semibold mb-3 text-gray-900 flex items-center gap-2">
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

      {/* Qualifications */}
      {job.required_qualifications && (
        <div>
          <h4 className="font-semibold mb-3 text-gray-900 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Required Qualifications
          </h4>
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
            {job.required_qualifications.map((qual, index) => (
              <li key={index}>{qual}</li>
            ))}
          </ul>
          
          {job.min_years_experience > 0 && (
            <p className="mt-3 text-sm text-gray-700">
              Minimum {job.min_years_experience} years of relevant experience required
            </p>
          )}
        </div>
      )}

      {/* Benefits & Perks */}
      <div>
        <h4 className="font-semibold mb-3 text-gray-900 flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          Benefits & Perks
        </h4>
        <ul className="text-sm text-gray-700 space-y-2">
          <li className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            {job.holiday_entitlement || 25} days annual leave
          </li>
          {formatBenefits(job.company_benefits).map((benefit, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="w-1 h-1 bg-primary rounded-full" />
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      {/* Additional Requirements */}
      {(job.citizenship_essential || job.required_citizenship) && (
        <div className="text-sm text-gray-700 p-4 bg-gray-50 rounded-lg">
          <p className="font-medium mb-2">Additional Requirements:</p>
          {job.citizenship_essential && (
            <p>{job.required_citizenship || 'Must have right to work in the UK'}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default JobDetails;
