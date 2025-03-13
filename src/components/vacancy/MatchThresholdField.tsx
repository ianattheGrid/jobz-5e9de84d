
import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Control } from "react-hook-form";
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

  const getMatchColor = (value: number) => {
    if (value >= 90) return "text-red-500";
    if (value >= 75) return "text-orange-500";
    if (value >= 60) return "text-green-500";
    if (value >= 45) return "text-blue-500";
    return "text-gray-500";
  };

  return (
    <Card className="border bg-white shadow-sm">
      <CardHeader className="bg-gray-50 rounded-t-lg border-b">
        <CardTitle className="text-gray-900">Candidate Matching Preferences</CardTitle>
        <CardDescription className="text-gray-600">
          Configure how strictly you want to match candidates to your job requirements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <FormItem className="space-y-3">
          <FormLabel className="text-gray-900">Would you like to use jobz's intelligent matching algorithm to automatically filter candidates?</FormLabel>
          <RadioGroup
            defaultValue="yes"
            onValueChange={handleMatchingChange}
            className="flex flex-row space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="matching-yes" />
              <label htmlFor="matching-yes" className="text-gray-700">Yes</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="matching-no" />
              <label htmlFor="matching-no" className="text-gray-700">No</label>
            </div>
          </RadioGroup>
        </FormItem>

        {showMatchingOptions && (
          <FormField
            control={control}
            name="matchThreshold"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel className="text-gray-900">Match Threshold</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                      className="w-full"
                    />
                    <div className="flex justify-end">
                      <span className={`font-medium ${getMatchColor(field.value)}`}>
                        {field.value}%
                      </span>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default MatchThresholdField;

