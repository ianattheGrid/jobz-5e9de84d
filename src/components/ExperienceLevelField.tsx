import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { GraduationCap, Briefcase, Award } from "lucide-react";

interface ExperienceLevelFieldProps {
  control: Control<any>;
}

const experienceLevels = [
  {
    value: "entry",
    label: "Entry Level / First Job",
    description: "New to work or just starting out (students, graduates, career starters)",
    icon: GraduationCap
  },
  {
    value: "some",
    label: "Some Experience (1-3 years)",
    description: "Building your career with some professional experience",
    icon: Briefcase
  },
  {
    value: "experienced",
    label: "Experienced Professional (3+ years)",
    description: "Established in your field with significant experience",
    icon: Award
  }
];

const ExperienceLevelField = ({ control }: ExperienceLevelFieldProps) => {
  return (
    <FormField
      control={control}
      name="experience_level"
      render={({ field }) => (
        <FormItem className="space-y-4">
          <FormLabel className="text-base font-semibold">What's your experience level?</FormLabel>
          <FormDescription>
            This helps us tailor the form to your situation and match you with suitable opportunities.
          </FormDescription>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="grid gap-4"
            >
              {experienceLevels.map((level) => {
                const Icon = level.icon;
                return (
                  <div key={level.value} className="relative">
                    <RadioGroupItem
                      value={level.value}
                      id={level.value}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={level.value}
                      className="flex items-start gap-4 rounded-lg border-2 border-muted bg-popover p-4 cursor-pointer transition-all hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Icon className="h-6 w-6 mt-0.5 text-primary" />
                      <div className="space-y-1">
                        <p className="font-medium leading-none">{level.label}</p>
                        <p className="text-sm text-muted-foreground">{level.description}</p>
                      </div>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ExperienceLevelField;
