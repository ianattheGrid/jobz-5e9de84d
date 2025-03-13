
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Control } from "react-hook-form";
import { InfoIcon } from "lucide-react";
import { useState } from "react";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface MatchThresholdFieldProps {
  control: Control<any>;
}

const MatchThresholdField = ({ control }: MatchThresholdFieldProps) => {
  const [showMatchingOptions, setShowMatchingOptions] = useState(true);

  const handleMatchingChange = (value: string) => {
    const isEnabled = value === 'yes';
    setShowMatchingOptions(isEnabled);
    if (!isEnabled) {
      control._formValues.matchThreshold = 0;
    } else {
      control._formValues.matchThreshold = 60;
    }
  };

  const getMatchDescription = (value: number) => {
    if (value >= 90) return "Very strict - might miss good candidates";
    if (value >= 75) return "Strict - high quality matches only";
    if (value >= 60) return "Balanced - recommended";
    if (value >= 45) return "Relaxed - wider candidate pool";
    return "Very relaxed - may include less relevant matches";
  };

  const getMatchColor = (value: number) => {
    if (value >= 90) return "bg-red-500";
    if (value >= 75) return "bg-orange-500";
    if (value >= 60) return "bg-green-500";
    if (value >= 45) return "bg-blue-500";
    return "bg-gray-500";
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>Candidate Matching Preferences</CardTitle>
        <CardDescription>
          Configure how strictly you want to match candidates to your job requirements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormItem className="space-y-3">
          <FormLabel>Would you like to use jobz's intelligent matching algorithm to automatically filter candidates?</FormLabel>
          <RadioGroup
            defaultValue="yes"
            onValueChange={handleMatchingChange}
            className="flex flex-row space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="matching-yes" />
              <label htmlFor="matching-yes">Yes</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="matching-no" />
              <label htmlFor="matching-no">No</label>
            </div>
          </RadioGroup>
        </FormItem>

        {showMatchingOptions && (
          <div className="space-y-6">
            <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-600">
              <div className="flex items-start gap-2">
                <InfoIcon className="h-5 w-5 mt-0.5" />
                <div>
                  <p className="font-medium mb-1">Matching Score Guidelines</p>
                  <p>A 100% match is extremely rare as it would require perfect alignment across all criteria. We recommend:</p>
                  <ul className="list-disc ml-4 mt-2 space-y-1">
                    <li>60-70% for a balanced pool of qualified candidates</li>
                    <li>70-80% for highly specific roles</li>
                    <li>Above 80% only for extremely specialized positions</li>
                  </ul>
                </div>
              </div>
            </div>

            <FormField
              control={control}
              name="matchThreshold"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel>Match Threshold</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <Slider
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        min={0}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex items-center gap-4">
                        <Progress value={field.value} className={getMatchColor(field.value)} />
                        <span className="min-w-[4rem] text-right">{field.value}%</span>
                      </div>
                      <div className="text-sm font-medium text-gray-700">
                        {getMatchDescription(field.value)}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MatchThresholdField;
