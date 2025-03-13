
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
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
    if (value >= 90) return "bg-red-500";
    if (value >= 75) return "bg-orange-500";
    if (value >= 60) return "bg-green-500";
    if (value >= 45) return "bg-blue-500";
    return "bg-gray-500";
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
                  <div className="flex items-center gap-4 bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                    <Progress value={field.value} className={`${getMatchColor(field.value)} h-3 flex-grow`} />
                    <input 
                      type="number"
                      value={field.value}
                      onChange={(e) => field.onChange(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                      className="w-16 text-right font-medium text-gray-700 bg-white border rounded px-2 py-1"
                    />
                    <span className="text-gray-700">%</span>
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
