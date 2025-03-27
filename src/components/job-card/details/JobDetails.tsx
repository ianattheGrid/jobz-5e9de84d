
import { MapPin, PoundSterling, Clock, Briefcase, Calendar, User, Landmark, Award } from "lucide-react";
import { Job } from "@/integrations/supabase/types/jobs";
import { formatSalary } from "../utils";
import { format } from "date-fns";

interface JobDetailsProps {
  job: Job;
}

const JobDetails = ({ job }: JobDetailsProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1 text-gray-900">{job.title}</h2>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Landmark className="h-4 w-4 mt-0.5 text-gray-700" />
            <span className="text-gray-900">{job.company}</span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 text-gray-700" />
            <span className="text-gray-900">{job.location}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <PoundSterling className="h-4 w-4 text-gray-700" />
            <span className="text-sm text-gray-900">
              £{job.salary_min.toLocaleString()} - £{job.salary_max.toLocaleString()}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-gray-700" />
            <span className="text-sm text-gray-900">{job.type}</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-700" />
            <span className="text-sm text-gray-900">
              {job.holiday_entitlement} days holiday
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-700" />
            <span className="text-sm text-gray-900">
              Posted {format(new Date(job.created_at), 'dd MMM yyyy')}
            </span>
          </div>
        </div>
      </div>

      {(job.min_years_experience > 0 || job.min_years_in_title > 0) && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-900">Experience Requirements</h3>
          {job.min_years_experience > 0 && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-700" />
              <span className="text-sm text-gray-900">
                Minimum {job.min_years_experience} years of general experience
              </span>
            </div>
          )}
          {job.min_years_in_title > 0 && (
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-gray-700" />
              <span className="text-sm text-gray-900">
                Minimum {job.min_years_in_title} years in similar role
              </span>
            </div>
          )}
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Job Description</h3>
        <p className="text-sm text-gray-800 whitespace-pre-line">{job.description}</p>
      </div>

      {job.company_benefits && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Company Benefits</h3>
          <p className="text-sm text-gray-800 whitespace-pre-line">{job.company_benefits}</p>
        </div>
      )}

      {job.required_skills && job.required_skills.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Required Skills</h3>
          <div className="flex flex-wrap gap-2">
            {job.required_skills.map((skill, index) => (
              <span key={index} className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {job.required_qualifications && job.required_qualifications.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Required Qualifications</h3>
          <div className="flex flex-wrap gap-2">
            {job.required_qualifications.map((qual, index) => (
              <span key={index} className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                {qual}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
