import { Job } from "@/integrations/supabase/types/jobs";
import { formatSalary } from "./utils";

interface JobCardFrontProps {
  job: Job;
}

const JobCardFront = ({ job }: JobCardFrontProps) => {
  return (
    <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm h-full flex flex-col">
      <div className="mb-4 flex items-start justify-between">
        <div className="text-left">
          <h3 className="text-xl font-semibold text-red-800">{job.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{job.company}</p>
        </div>
        <span className="text-sm font-medium px-3 py-1 bg-red-800/10 rounded-full">
          {job.type}
        </span>
      </div>
      
      <div className="space-y-4 text-left flex-grow">
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
          <div className="flex items-center space-x-2 text-sm text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Bonus available - Click to view details</span>
          </div>
        )}

        <div>
          <h4 className="font-medium mb-2 text-red-800">Full Description</h4>
          <p className="text-sm text-gray-600 whitespace-pre-line">
            {job.description}
          </p>
        </div>
      </div>

      <button 
        className="w-full mt-6 text-sm text-red-800 hover:text-red-900 flex items-center justify-center group"
      >
        View more details
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