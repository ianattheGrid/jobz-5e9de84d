import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Control } from "react-hook-form";

interface CareerChangeRadioProps {
  control: Control<any>;
  onCareerChangeResponse: (value: string) => void;
}

const CareerChangeRadio = ({ control, onCareerChangeResponse }: CareerChangeRadioProps) => {
  return (
    <FormField
      control={control}
      name="wantsCareerChange"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Are you looking to change your job title for your next role?</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={(value) => {
                field.onChange(value);
                onCareerChangeResponse(value);
              }}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="yes" />
                </FormControl>
                <FormLabel className="font-normal">
                  Yes, I want to change my job title
                </FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="no" />
                </FormControl>
                <FormLabel className="font-normal">
                  No, I want to continue in my current role
                </FormLabel>
              </FormItem>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CareerChangeRadio;