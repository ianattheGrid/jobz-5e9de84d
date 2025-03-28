
import { Slider } from "@/components/ui/slider";
import { useMatchThresholdSettings } from "@/hooks/useMatchThresholdSettings";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MatchThresholdEditorProps {
  jobId: number;
}

export const MatchThresholdEditor = ({ jobId }: MatchThresholdEditorProps) => {
  const { threshold, updating, updateThreshold } = useMatchThresholdSettings(jobId);
  const [value, setValue] = useState<number[]>([threshold]);
  const [changed, setChanged] = useState(false);

  const handleChange = (newValue: number[]) => {
    setValue(newValue);
    setChanged(threshold !== newValue[0]);
  };

  const handleSave = async () => {
    if (value[0] !== threshold) {
      await updateThreshold(value[0]);
      setChanged(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">Match Score Threshold</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-[250px] text-xs">
                  Set the minimum match score percentage required for a candidate to be 
                  highlighted for this position. Lower scores mean more candidates will 
                  be shown as potential matches.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription>
          Set the minimum match percentage (currently: {threshold}%)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>More candidates (50%)</span>
              <span>Balanced (70%)</span>
              <span>Better matches (90%)</span>
            </div>
            <Slider
              value={value}
              min={50}
              max={90}
              step={5}
              onValueChange={handleChange}
              className="w-full"
            />
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm font-medium">
                Current setting: <span className="font-bold">{value[0]}%</span>
              </div>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={updating || !changed}
                className="ml-auto"
              >
                {updating ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Saving
                  </span>
                ) : changed ? (
                  "Save Changes"
                ) : (
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    Saved
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
