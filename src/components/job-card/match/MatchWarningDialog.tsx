
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MatchWarningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  matchScore: number;
  matchThreshold: number;
  onProceed: () => void;
}

const MatchWarningDialog = ({
  open,
  onOpenChange,
  matchScore,
  matchThreshold,
  onProceed,
}: MatchWarningDialogProps) => {
  // Calculate minimum allowed score (10% leeway)
  const minimumAllowedScore = Math.max(0, matchThreshold - 10);
  const isTooLowScore = matchScore < minimumAllowedScore;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isTooLowScore ? "Match Score Too Low" : "Low Match Score Warning"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isTooLowScore ? (
              <>
                Your profile has a match score of {matchScore}%, which is more than 10% below 
                the employer's minimum threshold of {matchThreshold}%. Unfortunately, you cannot 
                proceed with this application. Please update your profile or look for positions 
                that better match your qualifications.
              </>
            ) : (
              <>
                Your profile has a match score of {matchScore}%, which is below the employer's 
                minimum threshold of {matchThreshold}%, but within the 10% leeway allowed. 
                While you can still apply, please note that your application might have a lower 
                chance of being selected. Would you like to proceed with your application?
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>Cancel</AlertDialogCancel>
          {!isTooLowScore && (
            <AlertDialogAction onClick={onProceed}>
              Proceed Anyway
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MatchWarningDialog;
