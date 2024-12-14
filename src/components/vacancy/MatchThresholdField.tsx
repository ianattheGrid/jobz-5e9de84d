import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { Control } from "react-hook-form";
import { InfoIcon } from "lucide-react";

interface MatchThresholdFieldProps {
  control: Control<any>;
}

const MatchThresholdField = ({ control }: MatchThresholdFieldProps) => {
  return (
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
  );
};

export default MatchThresholdField;