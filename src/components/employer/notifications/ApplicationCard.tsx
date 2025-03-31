
import { Button } from "@/components/ui/button";
import { ApplicationWithDetails } from "@/types/applications";
import { UserCheck } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ApplicationCardProps {
  application: ApplicationWithDetails;
  onAccept: (id: number) => Promise<void>;
  onReject: (id: number) => Promise<void>;
}

const ApplicationCard = ({ application, onAccept, onReject }: ApplicationCardProps) => {
  return (
    <div className="p-3 rounded-lg bg-muted">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium">
          {application.jobs.title}
        </p>
        {application.vrRecommendation && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center text-xs text-pink-600 font-medium">
                  <UserCheck className="h-3.5 w-3.5 mr-1" />
                  <span>VR Recommended</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Recommended by {application.vrRecommendation.vr.name} ({application.vrRecommendation.vr.vrNumber})</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <p className="text-sm text-muted-foreground">
        {application.candidate_profiles ? 
          `Candidate: ${application.candidate_profiles.job_title} with ${application.candidate_profiles.years_experience} years experience`
          : 'Candidate profile not available'
        }
      </p>
      <div className="mt-2 flex gap-2">
        <Button
          size="sm"
          variant="default"
          onClick={() => onAccept(application.id)}
        >
          Accept
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onReject(application.id)}
        >
          Reject
        </Button>
      </div>
    </div>
  );
};

export default ApplicationCard;
