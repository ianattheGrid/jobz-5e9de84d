
import { PoundSterling, MapPin, Building2, Clock, BriefcaseIcon } from "lucide-react";
import { formatSalary } from "./utils";
import { JobCardFrontProps } from "./types";
import { PRIMARY_COLOR_PATTERN } from "@/styles/colorPatterns";

const JobCardFront = ({ job, showEmployerDetails = false, onFlip }: JobCardFrontProps) => {
  const hasBonus = !!job.candidate_commission;

  return (
    <div 
      className={`h-full p-6 flex flex-col bg-card rounded-lg border border-border`}
      onClick={(e) => {
        e.stopPropagation();
        onFlip?.();
      }}
    >
      <div className="mb-6">
        <div className="flex justify-between items-start gap-4">
          <h3 className={`text-xl font-semibold ${PRIMARY_COLOR_PATTERN}`}>
            {job.title}
          </h3>
          <span className="px-2 py-1 text-xs font-medium bg-primary text-white rounded-full whitespace-nowrap flex-shrink-0">
            {job.type}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {showEmployerDetails ? job.company : "Company details hidden until match"}
          </p>
        </div>
      </div>

      <div className="space-y-4 flex-grow">
        <div className="flex items-center text-sm text-foreground">
          <MapPin className="h-4 w-4 mr-2 flex-shrink-0 text-primary" />
          <span className="truncate">{job.location}</span>
        </div>

        <div className="flex items-center text-sm text-foreground">
          <Clock className="h-4 w-4 mr-2 flex-shrink-0 text-primary" />
          <span>{job.type}</span>
        </div>

        <div className="flex items-center text-sm">
          <PoundSterling className="h-4 w-4 mr-2 flex-shrink-0 text-primary" />
          <span className="text-foreground">
            {formatSalary(job.salary_min)} - {formatSalary(job.salary_max)}
          </span>
        </div>

        {job.required_skills && job.required_skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {job.required_skills.slice(0, 3).map((skill, index) => (
              <span key={index} className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                {skill}
              </span>
            ))}
            {job.required_skills.length > 3 && (
              <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                +{job.required_skills.length - 3} more
              </span>
            )}
          </div>
        )}

        {hasBonus && (
          <div className="text-sm bg-primary/10 p-3 rounded-md border border-primary/20">
            <span className={`font-medium flex items-center gap-2 ${PRIMARY_COLOR_PATTERN}`}>
              <PoundSterling className="h-4 w-4" />
              Exclusive "You're Hired" Bonus
            </span>
            <p className="text-foreground text-xs mt-1">
              This position comes with our unique "You're Hired" bonus scheme. View details for more information.
            </p>
          </div>
        )}

        <div>
          <h4 className="font-medium text-sm text-foreground mb-2">Job Summary</h4>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {job.description}
          </p>
        </div>
      </div>

      <button 
        onClick={(e) => {
          e.stopPropagation();
          onFlip?.();
        }}
        className="w-full mt-6 text-sm bg-primary text-white hover:bg-primary/90 transition-colors py-2 rounded-md flex items-center justify-center group"
      >
        View Full Details
        <BriefcaseIcon className="h-4 w-4 ml-2 transform transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );
};

export default JobCardFront;
