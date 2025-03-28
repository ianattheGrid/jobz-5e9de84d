
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

interface MatchWarningContentProps {
  matchWarningInfo: {
    isEssentialMismatch: boolean;
    totalScore: number;
    failedCriteria: string[];
    matchThreshold: number;
  };
  onCancel: () => void;
  onProceed: () => void;
}

export const MatchWarningContent = ({ matchWarningInfo, onCancel, onProceed }: MatchWarningContentProps) => {
  const { isEssentialMismatch, totalScore, failedCriteria, matchThreshold } = matchWarningInfo;
  
  const scorePercentage = Math.round(totalScore * 100);
  const isLowScore = scorePercentage < matchThreshold;
  
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl flex items-center gap-2">
          {isEssentialMismatch ? (
            <>
              <XCircle className="h-6 w-6 text-red-500" />
              Essential Criteria Not Met
            </>
          ) : isLowScore ? (
            <>
              <AlertCircle className="h-6 w-6 text-amber-500" />
              Low Match Score
            </>
          ) : (
            <>
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              Proceed with Application
            </>
          )}
        </DialogTitle>
        <DialogDescription className="text-base pt-2">
          {isEssentialMismatch ? 
            "Your profile doesn't meet some essential criteria for this role:" :
            isLowScore ? 
              `Your match score (${scorePercentage}%) is below the employer's threshold of ${matchThreshold}%.` :
              "You meet the basic requirements for this role, but there are some areas where your profile doesn't perfectly match:"}
        </DialogDescription>
      </DialogHeader>
      
      {failedCriteria.length > 0 && (
        <div className="max-h-[200px] overflow-y-auto my-4">
          <ul className="space-y-2 list-disc pl-5">
            {failedCriteria.map((criteria, index) => (
              <li key={index} className="text-sm text-red-600">{criteria}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="bg-muted p-4 rounded-lg my-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Your Match Score:</span>
          <span className={`text-sm font-bold ${
            scorePercentage >= matchThreshold ? "text-green-600" : "text-red-600"
          }`}>
            {scorePercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div 
            className={`h-2.5 rounded-full ${
              scorePercentage >= matchThreshold ? "bg-green-600" : "bg-red-600"
            }`} 
            style={{ width: `${scorePercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>0%</span>
          <span>Employer threshold: {matchThreshold}%</span>
          <span>100%</span>
        </div>
      </div>
      
      {isEssentialMismatch ? (
        <DialogFooter className="flex-col sm:flex-col gap-2">
          <p className="text-sm text-muted-foreground mb-2">
            This employer requires all essential criteria to be met. Please update your profile or search for roles that better match your qualifications.
          </p>
          <Button onClick={onCancel} className="w-full">
            Back to Job Search
          </Button>
        </DialogFooter>
      ) : (
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            onClick={onProceed}
            disabled={isEssentialMismatch}
            variant={isLowScore ? "outline" : "default"}
            className={!isLowScore ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {isLowScore 
              ? "Proceed Anyway" 
              : "Continue with Application"}
          </Button>
        </DialogFooter>
      )}
    </>
  );
};
