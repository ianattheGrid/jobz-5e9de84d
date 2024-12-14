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
  matchScore: number | null;
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
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Low Match Score Warning</AlertDialogTitle>
          <AlertDialogDescription>
            Your profile has a match score of {matchScore}%, which is below the employer's minimum threshold of {matchThreshold}%. 
            While you can still apply, please note that your application might have a lower chance of being selected.
            Would you like to proceed with your application?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onProceed}>
            Proceed Anyway
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MatchWarningDialog;