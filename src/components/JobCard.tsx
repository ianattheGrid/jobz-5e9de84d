import { Database } from "@/integrations/supabase/types";
import { useState } from "react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

type Job = Database['public']['Tables']['jobs']['Row'];

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const formatSalary = (amount: number) => `£${amount.toLocaleString()}`;
  
  const calculateReferralCommission = (totalCommission: number) => {
    return Math.floor(totalCommission * 0.3);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className="relative h-[400px] perspective-1000"
      onClick={handleFlip}
    >
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        className={`w-full h-full relative preserve-3d cursor-pointer`}
      >
        {/* Front of card */}
        <div className={`absolute w-full h-full backface-hidden ${isFlipped ? 'invisible' : ''}`}>
          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm h-full">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-primary">{job.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{job.company}</p>
              </div>
              <span className="text-sm font-medium px-3 py-1 bg-primary/10 rounded-full">
                {job.type}
              </span>
            </div>
            
            <div className="space-y-4">
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
                <div className="space-y-2 p-3 bg-green-50 rounded-md">
                  <p className="text-sm font-medium text-green-700">
                    Commission Structure
                  </p>
                  <div className="text-sm text-green-600 space-y-1">
                    <p>Total Commission: {formatSalary(job.candidate_commission)}</p>
                    <div className="text-xs space-y-0.5">
                      <p>• Candidate: {formatSalary(job.candidate_commission - calculateReferralCommission(job.candidate_commission))}</p>
                      <p>• Referral: {formatSalary(calculateReferralCommission(job.candidate_commission))}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <p className="text-sm text-gray-600 line-clamp-3">
                  {job.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div 
          className={`absolute w-full h-full backface-hidden rotate-y-180 ${!isFlipped ? 'invisible' : ''}`}
        >
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
                <ul className="text-sm text-gray-600 list-disc pl-4">
                  <li>Holiday Entitlement: {job.holiday_entitlement} days</li>
                  {job.company_benefits && (
                    <li>{job.company_benefits}</li>
                  )}
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
        </div>
      </motion.div>
    </div>
  );
};

export default JobCard;