import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import JobTitleSelect from "../JobTitleSelect";
import { 
  civilEngineeringTitles,
  mechanicalEngineeringTitles,
  electricalEngineeringTitles,
  chemicalEngineeringTitles,
  aerospaceEngineeringTitles,
  environmentalEngineeringTitles,
  softwareEngineeringTitles,
  energyEngineeringTitles,
  manufacturingEngineeringTitles,
  marineEngineeringTitles,
  biomedicalEngineeringTitles,
  miningEngineeringTitles,
  projectManagementTitles,
  specializedEngineeringTitles
} from "../constants/engineering";

interface EngineeringSpecializationSelectProps {
  control: Control<any>;
  onSpecializationChange?: (value: string) => void;
}

const EngineeringSpecializationSelect = ({ control, onSpecializationChange }: EngineeringSpecializationSelectProps) => {
  const specializations = [
    "Civil Engineering",
    "Mechanical Engineering",
    "Electrical and Electronics Engineering",
    "Chemical and Process Engineering",
    "Aerospace and Aeronautical Engineering",
    "Environmental and Sustainability Engineering",
    "Software and Systems Engineering",
    "Energy and Utilities Engineering",
    "Manufacturing and Industrial Engineering",
    "Marine and Offshore Engineering",
    "Biomedical and Medical Engineering",
    "Mining and Geological Engineering",
    "Project Management and Leadership",
    "Specialized and Emerging Engineering"
  ];

  const getTitlesForSpecialization = (specialization: string) => {
    switch (specialization) {
      case "Civil Engineering":
        return civilEngineeringTitles;
      case "Mechanical Engineering":
        return mechanicalEngineeringTitles;
      case "Electrical and Electronics Engineering":
        return electricalEngineeringTitles;
      case "Chemical and Process Engineering":
        return chemicalEngineeringTitles;
      case "Aerospace and Aeronautical Engineering":
        return aerospaceEngineeringTitles;
      case "Environmental and Sustainability Engineering":
        return environmentalEngineeringTitles;
      case "Software and Systems Engineering":
        return softwareEngineeringTitles;
      case "Energy and Utilities Engineering":
        return energyEngineeringTitles;
      case "Manufacturing and Industrial Engineering":
        return manufacturingEngineeringTitles;
      case "Marine and Offshore Engineering":
        return marineEngineeringTitles;
      case "Biomedical and Medical Engineering":
        return biomedicalEngineeringTitles;
      case "Mining and Geological Engineering":
        return miningEngineeringTitles;
      case "Project Management and Leadership":
        return projectManagementTitles;
      case "Specialized and Emerging Engineering":
        return specializedEngineeringTitles;
      default:
        return [];
    }
  };

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="engineeringSpecialization"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Engineering Specialization</FormLabel>
            <FormControl>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  if (onSpecializationChange) {
                    onSpecializationChange(value);
                  }
                }}
                defaultValue={field.value}
              >
                <SelectTrigger className="w-full bg-white border border-gray-300">
                  <SelectValue placeholder="Select your engineering specialization" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {specializations.map((specialization) => (
                    <SelectItem key={specialization} value={specialization}>
                      {specialization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
            {field.value && (
              <JobTitleSelect 
                control={control} 
                titles={getTitlesForSpecialization(field.value)}
                name="title"
              />
            )}
          </FormItem>
        )}
      />
    </div>
  );
};

export default EngineeringSpecializationSelect;
