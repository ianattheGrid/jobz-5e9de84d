import { PoundSterling } from "lucide-react";
import { formatSalary } from "./utils";
import { JobCardFrontProps } from "./types";

const JobCardFront = ({ job, showEmployerDetails = false, onApply }: JobCardFrontProps) => {
  return (
    <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm h-full flex flex-col">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold text-red-800">{job.title}</h3>
          {showEmployerDetails ? (
            <p className="text-sm text-muted-foreground mt-1">{job.company}</p>
          ) : (
            <p className="text-sm text-muted-foreground mt-1">Company details hidden until match</p>
          )}
        </div>
        <span className="text-sm font-medium px-3 py-1 bg-red-50 text-red-800 rounded-full">
          {job.type}
        </span>
      </div>
      
      <div className="space-y-4 flex-grow">
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
          <div className="flex items-center space-x-2 text-sm text-red-800">
            <PoundSterling className="h-4 w-4" />
            <span>Bonus available - Click to view details</span>
          </div>
        )}

        <div className="mt-4">
          <h4 className="font-medium mb-2">Job Description</h4>
          <p className="text-sm text-muted-foreground line-clamp-4">
            {job.description}
          </p>
        </div>
      </div>

      <button 
        onClick={onApply}
        className="w-full mt-8 text-sm text-red-800 hover:text-red-900 flex items-center justify-center group bg-red-50 py-2 rounded-md"
      >
        Apply Now
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