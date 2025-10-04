
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HelpCircle } from "lucide-react";

interface MatchThresholdFieldProps {
  control: Control<any>;
  onMatchingChange: (useMatching: boolean) => void;
}

const MatchThresholdField = ({ control, onMatchingChange }: MatchThresholdFieldProps) => {
  const [showMatchingOptions, setShowMatchingOptions] = useState(true);

  const handleMatchingChange = (value: string) => {
    const isEnabled = value === 'yes';
    setShowMatchingOptions(isEnabled);
    onMatchingChange(isEnabled);
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

  const getMatchDescription = (value: number) => {
    if (value >= 90) return "Very high threshold";
    if (value >= 75) return "High threshold";
    if (value >= 60) return "Recommended threshold";
    if (value >= 45) return "Lower threshold";
    return "Very low threshold";
  };

  return (
    <Card className="border bg-white shadow-sm">
      <CardHeader className="bg-gray-50 rounded-t-lg border-b">
        <div className="flex items-center gap-2">
          <CardTitle className="text-gray-900">Candidate Matching Preferences</CardTitle>
          <Popover>
            <PopoverTrigger asChild>
              <button className="hover:bg-gray-100 p-1 rounded-full transition-colors">
                <HelpCircle className="h-5 w-5 text-gray-500 hover:text-gray-700" />
              </button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-80 z-50 shadow-lg"
              side="right"
              align="start"
              sideOffset={5}
            >
              <div className="space-y-2">
                <h4 className="font-medium">Match Threshold Guide</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">60-70%:</span> Recommended for most roles - provides a good balance between matching requirements and finding skilled candidates</p>
                  <p><span className="font-medium">70-80%:</span> Better for specialized roles where specific experience is important</p>
                  <p><span className="font-medium">80-90%:</span> Use carefully - may exclude qualified candidates with transferable skills</p>
                  <p><span className="font-medium">90%+:</span> Not recommended - likely to miss excellent candidates with equivalent skills or experience</p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <CardDescription className="text-gray-600">
          Configure how strictly you want to match candidates to your job requirements
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        <FormItem className="space-y-3">
          <FormLabel className="text-gray-900">Would you like to use Jobz's intelligent matching algorithm to automatically filter candidates?</FormLabel>
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
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">
                        {getMatchDescription(field.value)}
                      </p>
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
