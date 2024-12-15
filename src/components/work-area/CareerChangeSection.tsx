import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Control } from "react-hook-form";

interface CareerChangeSectionProps {
  control: Control<any>;
  showCareerChange: boolean;
  wantsCareerChange: boolean;
  onCareerChangeResponse: (value: string) => void;
}

const CareerChangeSection = ({ 
  control, 
  showCareerChange, 
  wantsCareerChange,
  onCareerChangeResponse 
}: CareerChangeSectionProps) => {
  if (!showCareerChange) return null;

  return (
    <>
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

      {wantsCareerChange && (
        <>
          <FormField
            control={control}
            name="desired_job_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Desired Job Title</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="What role would you like to move into next?" 
                    className="bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {control._formValues.desired_job_title && (
            <FormField
              control={control}
              name="desired_years_experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years experience in {control._formValues.desired_job_title}</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select years of experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">No experience</SelectItem>
                        <SelectItem value="1-2">1-2 years</SelectItem>
                        <SelectItem value="3-4">3-4 years</SelectItem>
                        <SelectItem value="5-6">5-6 years</SelectItem>
                        <SelectItem value="7-8">7-8 years</SelectItem>
                        <SelectItem value="9-10">9-10 years</SelectItem>
                        <SelectItem value="10+">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </>
      )}
    </>
  );
};

export default CareerChangeSection;