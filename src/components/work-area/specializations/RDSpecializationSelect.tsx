
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { rdSpecializations } from "../constants/rd-roles";
import JobTitleSelect from "../JobTitleSelect";
import { rdRoles } from "../constants/rd-roles";

interface RDSpecializationSelectProps {
  control: Control<any>;
  onSpecializationChange: (value: string) => void;
}

const RDSpecializationSelect = ({ control, onSpecializationChange }: RDSpecializationSelectProps) => {
  const getTitlesForSpecialization = (specialization: string) => {
    const {
      productRDTitles,
      scientificResearchTitles,
      biomedicalResearchTitles,
      engineeringRDTitles,
      environmentalResearchTitles,
      technologyResearchTitles,
      industrialResearchTitles,
      materialsResearchTitles,
      clinicalResearchTitles,
      agriculturalResearchTitles
    } = rdRoles;

    switch (specialization) {
      case "Product Research and Development":
        return productRDTitles;
      case "Scientific Research":
        return scientificResearchTitles;
      case "Biomedical Research":
        return biomedicalResearchTitles;
      case "Engineering R&D":
        return engineeringRDTitles;
      case "Environmental Research":
        return environmentalResearchTitles;
      case "Technology Research":
        return technologyResearchTitles;
      case "Industrial Research":
        return industrialResearchTitles;
      case "Materials Research":
        return materialsResearchTitles;
      case "Clinical Research":
        return clinicalResearchTitles;
      case "Agricultural Research":
        return agriculturalResearchTitles;
      default:
        return [];
    }
  };

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="specialization"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-900">R&D Specialization</FormLabel>
            <FormControl>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  onSpecializationChange(value);
                }}
                value={field.value}
              >
                <SelectTrigger className="w-full bg-white border border-gray-300">
                  <SelectValue placeholder="Select your R&D specialization" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {rdSpecializations.map((specialization) => (
                    <SelectItem key={specialization} value={specialization}>
                      {specialization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        )}
      />
      {field.value && (
        <JobTitleSelect 
          control={control} 
          titles={getTitlesForSpecialization(field.value)}
          name="title"
        />
      )}
    </div>
  );
};

export default RDSpecializationSelect;
