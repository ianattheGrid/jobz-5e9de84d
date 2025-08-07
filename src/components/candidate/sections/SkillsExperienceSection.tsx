import { Control, useWatch } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CandidateFormValues } from "../candidateFormSchema";

interface SkillsExperienceSectionProps {
  control: Control<CandidateFormValues>;
}

const SkillsExperienceSection = ({ control }: SkillsExperienceSectionProps) => {
  const watchedSkills = useWatch({
    control,
    name: "required_skills",
    defaultValue: [],
  });

  const experienceOptions = [
    { value: 0.5, label: "Less than 1 year" },
    { value: 1, label: "1 year" },
    { value: 2, label: "2 years" },
    { value: 3, label: "3 years" },
    { value: 4, label: "4 years" },
    { value: 5, label: "5 years" },
    { value: 7, label: "5-7 years" },
    { value: 10, label: "7-10 years" },
    { value: 15, label: "10+ years" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold border-l-4 border-primary pl-4 mb-4">
          Skills Experience Levels
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          For each of your skills, specify how many years of experience you have.
        </p>
        
        {watchedSkills && watchedSkills.length > 0 ? (
          <div className="space-y-4">
            {watchedSkills.map((skill: string, index: number) => (
              <Card key={`${skill}-${index}`} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{skill}</h4>
                  </div>
                  <div className="w-48">
                    <FormField
                      control={control}
                      name={`skills_experience.${skill}`}
                      render={({ field }) => (
                        <FormItem>
                          <Select 
                            onValueChange={(value) => field.onChange(parseFloat(value))}
                            value={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Years of experience" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {experienceOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value.toString()}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Add skills in the Skills section above to specify experience levels here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsExperienceSection;