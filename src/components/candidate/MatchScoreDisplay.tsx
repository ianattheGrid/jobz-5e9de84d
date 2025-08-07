import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { getMatchDescription, getMatchColor } from "@/components/job-card/utils/matchExplanation";

interface MatchScoreDisplayProps {
  matchPercentage: number;
  scoreBreakdown?: {
    title: number;
    specialization: number;
    location: number;
    experience: number;
    salary: number;
    total: number;
  };
  matchExplanation?: string;
  compact?: boolean;
}

const MatchScoreDisplay = ({ 
  matchPercentage, 
  scoreBreakdown, 
  matchExplanation, 
  compact = false 
}: MatchScoreDisplayProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const matchDescription = getMatchDescription(matchPercentage);
  const matchColor = getMatchColor(matchPercentage);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="outline" className={matchColor}>
          {matchPercentage}% Match
        </Badge>
        <span className="text-sm text-muted-foreground">{matchDescription}</span>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Your Match Score</span>
            <Badge variant="outline" className={matchColor}>
              {matchPercentage}%
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1"
          >
            <HelpCircle className="h-4 w-4" />
            {showDetails ? "Hide Details" : "Why this score?"}
            {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className={`text-3xl font-bold ${matchColor}`}>
              {matchPercentage}%
            </div>
            <div className="text-lg text-muted-foreground">
              {matchDescription}
            </div>
          </div>

          {showDetails && (
            <div className="space-y-4 pt-4 border-t">
              {scoreBreakdown && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Score Breakdown:</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span>Job Title:</span>
                      <span className="font-medium">{scoreBreakdown.title}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Specialization:</span>
                      <span className="font-medium">{scoreBreakdown.specialization}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span className="font-medium">{scoreBreakdown.location}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Experience:</span>
                      <span className="font-medium">{scoreBreakdown.experience}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Salary:</span>
                      <span className="font-medium">{scoreBreakdown.salary}%</span>
                    </div>
                  </div>
                </div>
              )}

              {matchExplanation && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Detailed Analysis:</h4>
                  <div className="text-sm text-muted-foreground whitespace-pre-line bg-muted p-3 rounded-md">
                    {matchExplanation}
                  </div>
                </div>
              )}

              <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded-md">
                <strong>Note:</strong> This match score is just one factor employers consider. 
                Your experience, personality, and interview performance are equally important!
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchScoreDisplay;