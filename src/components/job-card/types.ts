
import { Job } from "@/integrations/supabase/types/jobs";

export interface JobCardFrontProps {
  job: Job;
  showEmployerDetails?: boolean;
  onFlip?: () => void;
}

export interface JobCardBackProps {
  job: Job;
  onClose: () => void;
}
