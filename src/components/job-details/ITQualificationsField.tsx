import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import QualificationSelector from "./QualificationSelector";

interface ITQualificationsFieldProps {
  control: Control<any>;
  value: { name: string; type: 'essential' | 'desirable' }[];
  onChange: (value: { name: string; type: 'essential' | 'desirable' }[]) => void;
}

const ITQualificationsField = ({ control, value, onChange }: ITQualificationsFieldProps) => {
  const handleSelect = (qualificationName: string) => {
    if (qualificationName === "None") {
      onChange([]);
    } else {
      onChange([{ name: qualificationName, type: 'desirable' }]);
    }
  };

  const handleTypeChange = (type: 'essential' | 'desirable') => {
    if (value.length > 0) {
      onChange([{ ...value[0], type }]);
    }
  };

  const selectedQualification = value[0]?.name || "None";

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="required_qualifications"
        render={({ field }) => (
          <FormItem>
            <FormLabel>IT Qualification Required</FormLabel>
            <FormControl>
              <QualificationSelector
                selectedQualification={selectedQualification}
                onSelect={handleSelect}
              />
            </FormControl>
            {selectedQualification !== "None" && (
              <div className="mt-4 space-y-3">
                <Label>Is this qualification essential or desirable?</Label>
                <RadioGroup
                  defaultValue={value[0]?.type || 'desirable'}
                  onValueChange={(val) => handleTypeChange(val as 'essential' | 'desirable')}
                  className="flex items-center space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="essential" id="essential" />
                    <Label htmlFor="essential">Essential</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="desirable" id="desirable" />
                    <Label htmlFor="desirable">Desirable</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ITQualificationsField;