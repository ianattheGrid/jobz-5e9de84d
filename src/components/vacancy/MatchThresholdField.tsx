import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Control } from "react-hook-form";
import { InfoIcon } from "lucide-react";
import { useState } from "react";

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

  return (
    <div className="space-y-6">
      <FormItem className="space-y-3">
        <FormLabel>Would you like to use Jobz's intelligent matching algorithm to automatically filter candidates who don't meet your requirements?</FormLabel>
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
        <FormField
          control={control}
          name="matchThreshold"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Match Threshold (%)</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Slider
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                    min={0}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <div className="text-sm text-muted-foreground">
                    Current value: {field.value}%
                  </div>
                </div>
              </FormControl>
              <div className="flex items-center gap-2 mt-1 text-sm text-blue-600">
                <InfoIcon className="h-3 w-3" />
                <span>Only candidates with a match score above this threshold will be automatically matched to this job</span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default MatchThresholdField;