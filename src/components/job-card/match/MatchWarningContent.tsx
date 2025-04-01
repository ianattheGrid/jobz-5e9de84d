
import { Button } from "@/components/ui/button";
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
  
  // Calculate the minimum allowed score (10% leeway)
  const minimumAllowedScore = Math.max(0, matchThreshold - 10);
  
  // Check if score is too low (outside the 10% leeway)
  const isTooLowScore = totalScore < minimumAllowedScore;
  const isLowScore = totalScore < matchThreshold;
  const isExactMatch = totalScore >= matchThreshold && totalScore < (matchThreshold + 15);
  const isHighMatch = totalScore >= (matchThreshold + 15);
  
  return (
    <>
      <div className="text-xl flex items-center gap-2 mb-4">
        {isEssentialMismatch ? (
          <>
            <XCircle className="h-6 w-6 text-red-500" />
            <h2 className="font-semibold">Essential Criteria Not Met</h2>
          </>
        ) : isTooLowScore ? (
          <>
            <XCircle className="h-6 w-6 text-red-500" />
            <h2 className="font-semibold">Match Score Too Low</h2>
          </>
        ) : isLowScore ? (
          <>
            <AlertCircle className="h-6 w-6 text-amber-500" />
            <h2 className="font-semibold">Low Match Score</h2>
          </>
        ) : isHighMatch ? (
          <>
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            <h2 className="font-semibold">Excellent Match!</h2>
          </>
        ) : (
          <>
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            <h2 className="font-semibold">Good Match</h2>
          </>
        )}
      </div>
      <div className="text-base pt-2 mb-4">
        {isEssentialMismatch ? 
          "Thank you for your interest. Unfortunately, your profile doesn't meet some essential criteria for this role:" :
          isTooLowScore ? 
            `Thank you for your interest. Your match score (${totalScore}%) is significantly below the employer's threshold of ${matchThreshold}%.` :
            isLowScore ? 
              `Your match score (${totalScore}%) is below the employer's threshold of ${matchThreshold}%, but within the 10% leeway allowed. You can still apply, but your application may have a lower chance of being selected.` :
              isHighMatch ?
                `Congratulations! Your profile is an excellent match (${totalScore}%) for this position, exceeding the employer's threshold of ${matchThreshold}%. Your application will be prioritized.` :
                `Good news! You meet the employer's match threshold of ${matchThreshold}% with your score of ${totalScore}%. Your profile aligns well with this role.`}
      </div>
      
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
            totalScore >= matchThreshold + 15 ? "text-green-600" :
            totalScore >= matchThreshold ? "text-green-500" : 
            totalScore >= minimumAllowedScore ? "text-amber-600" : "text-red-600"
          }`}>
            {totalScore}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div 
            className={`h-2.5 rounded-full ${
              totalScore >= matchThreshold + 15 ? "bg-green-600" :
              totalScore >= matchThreshold ? "bg-green-500" : 
              totalScore >= minimumAllowedScore ? "bg-amber-600" : "bg-red-600"
            }`} 
            style={{ width: `${totalScore}%` }}
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
        <div className="flex-col space-y-4 mt-6">
          <p className="text-sm text-muted-foreground">
            {isEssentialMismatch 
              ? "This employer requires all essential criteria to be met. We recommend updating your profile or searching for roles that better match your qualifications."
              : `Your match score is more than 10% below the required threshold. This employer requires at least ${minimumAllowedScore}% match score to apply.`
            }
          </p>
          <Button onClick={onCancel} className="w-full">
            Back to Job Search
          </Button>
        </div>
      ) : (
        <div className="flex justify-between mt-6">
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
        </div>
      )}
    </>
  );
};
