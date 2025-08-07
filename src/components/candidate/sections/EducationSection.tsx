import { Control, useFieldArray } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import { CandidateFormValues } from "../candidateFormSchema";

interface EducationSectionProps {
  control: Control<CandidateFormValues>;
}

const EducationSection = ({ control }: EducationSectionProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "education_details",
  });

  const addEducation = () => {
    append({
      institution: "",
      qualification: "",
      grade: "",
      year: new Date().getFullYear(),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold border-l-4 border-primary pl-4 mb-4">
          Education & Qualifications
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Add your educational background to help employers understand your qualifications.
        </p>
        
        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    Education #{index + 1}
                  </CardTitle>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name={`education_details.${index}.institution`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Institution</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., University of Bristol" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`education_details.${index}.qualification`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Qualification</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., BSc Computer Science" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name={`education_details.${index}.grade`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grade (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 2:1, First Class" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`education_details.${index}.year`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="e.g., 2020" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addEducation}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Education
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EducationSection;