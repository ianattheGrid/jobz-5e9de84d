import { Database } from "@/integrations/supabase/types";
import { useState } from "react";
import { motion } from "framer-motion";
import JobCardFront from "./job-card/JobCardFront";
import JobCardBack from "./job-card/JobCardBack";

type Job = Database['public']['Tables']['jobs']['Row'];

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

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
          <JobCardFront job={job} />
        </div>

        {/* Back of card */}
        <div 
          className={`absolute w-full h-full backface-hidden rotate-y-180 ${!isFlipped ? 'invisible' : ''}`}
        >
          <JobCardBack job={job} />
        </div>
      </motion.div>
    </div>
  );
};

export default JobCard;