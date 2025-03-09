
import { PoundSterling } from "lucide-react";
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
        <p className="text-sm text-muted-foreground mt-2">
          {showEmployerDetails ? job.company : "Company details hidden until match"}
        </p>
      </div>

      <div className="space-y-4 flex-grow">
        <div className="flex items-center text-sm text-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{job.location}</span>
        </div>

        <div className="text-sm">
          <span className="font-medium text-foreground">Salary Range: </span>
          <span className="text-foreground">
            {formatSalary(job.salary_min)} - {formatSalary(job.salary_max)}
          </span>
        </div>

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
        View Details
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4 ml-2 transform transition-transform group-hover:translate-x-1" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default JobCardFront;
