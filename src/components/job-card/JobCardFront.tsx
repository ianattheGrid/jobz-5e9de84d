
import { PoundSterling } from "lucide-react";
import { formatSalary } from "./utils";
import { JobCardFrontProps } from "./types";

const JobCardFront = ({ job, showEmployerDetails = false, onFlip }: JobCardFrontProps) => {
  const hasBonus = !!job.candidate_commission;

  return (
    <div className={`h-full p-6 flex flex-col ${hasBonus ? 'bg-[#1A1F2C]' : 'bg-[#222222]'} rounded-lg`}>
      <div className="mb-4">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-lg font-semibold text-[#F2F2F2] line-clamp-2 hover:text-primary/90">
            {job.title}
          </h3>
          <span className="px-2 py-1 text-xs font-medium bg-primary/20 text-primary rounded-full whitespace-nowrap flex-shrink-0">
            {job.type}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {showEmployerDetails ? job.company : "Company details hidden until match"}
        </p>
      </div>
      
      <div className="space-y-4 flex-grow">
        <div className="flex items-center text-sm text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{job.location}</span>
        </div>

        <div className="text-sm">
          <span className="font-medium text-[#F2F2F2]">Salary Range: </span>
          <span className="text-muted-foreground">
            {formatSalary(job.salary_min)} - {formatSalary(job.salary_max)}
          </span>
        </div>

        {hasBonus && (
          <div 
            onClick={(e) => {
              e.stopPropagation();
              onFlip?.();
            }}
            className="flex items-center space-x-2 text-sm bg-primary/10 p-3 rounded-md border border-primary/20 cursor-pointer hover:bg-primary/15 transition-colors"
          >
            <PoundSterling className="h-4 w-4 flex-shrink-0 text-primary" />
            <span className="text-primary font-medium">Click to view "You're Hired" Bonus details</span>
          </div>
        )}

        <div>
          <h4 className="font-medium mb-2 text-sm text-[#F2F2F2]">Summary</h4>
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
        Express Interest
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
