
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
  
  // Calculate the minimum allowed score (10% leeway)
  const minimumAllowedScore = Math.max(0, matchThreshold - 10);
  
  // Check if score is too low (outside the 10% leeway)
  const isTooLowScore = scorePercentage < minimumAllowedScore;
  
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl flex items-center gap-2">
          {isEssentialMismatch ? (
            <>
              <XCircle className="h-6 w-6 text-red-500" />
              Essential Criteria Not Met
            </>
          ) : isTooLowScore ? (
            <>
              <XCircle className="h-6 w-6 text-red-500" />
              Match Score Too Low
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
            isTooLowScore ? 
              `Your match score (${scorePercentage}%) is significantly below the employer's threshold of ${matchThreshold}%.` :
              isLowScore ? 
                `Your match score (${scorePercentage}%) is below the employer's threshold of ${matchThreshold}%, but within the 10% leeway allowed.` :
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
            scorePercentage >= matchThreshold ? "text-green-600" : 
            scorePercentage >= minimumAllowedScore ? "text-amber-600" : "text-red-600"
          }`}>
            {scorePercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div 
            className={`h-2.5 rounded-full ${
              scorePercentage >= matchThreshold ? "bg-green-600" : 
              scorePercentage >= minimumAllowedScore ? "bg-amber-600" : "bg-red-600"
            }`} 
            style={{ width: `${scorePercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>0%</span>
          <span>Min: {minimumAllowedScore}%</span>
          <span>Required: {matchThreshold}%</span>
          <span>100%</span>
        </div>
      </div>
      
      {isEssentialMismatch || isTooLowScore ? (
        <DialogFooter className="flex-col sm:flex-col gap-2">
          <p className="text-sm text-muted-foreground mb-2">
            {isEssentialMismatch 
              ? "This employer requires all essential criteria to be met. Please update your profile or search for roles that better match your qualifications."
              : `Your match score is more than 10% below the required threshold. This employer requires at least ${minimumAllowedScore}% match score to apply.`
            }
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
