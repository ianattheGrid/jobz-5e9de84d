import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { publicSectorSpecializations } from "../constants/public-sector";
import JobTitleSelect from "../JobTitleSelect";
import { 
  centralGovernmentRoles,
  localGovernmentRoles,
  healthcareRoles,
  educationRoles,
  lawEnforcementRoles,
  socialCareRoles,
  infrastructureRoles,
  environmentalRoles,
  regulatoryRoles,
  leadershipRoles,
  administrativeRoles,
  specializedRoles
} from "../constants/public-sector";

interface PublicSectorSpecializationSelectProps {
  control: Control<any>;
  onSpecializationChange: (value: string) => void;
}

const PublicSectorSpecializationSelect = ({ 
  control, 
  onSpecializationChange 
}: PublicSectorSpecializationSelectProps) => {
  const getTitlesForSpecialization = (specialization: string) => {
    switch (specialization) {
      case "Central Government":
        return centralGovernmentRoles;
      case "Local Government":
        return localGovernmentRoles;
      case "Healthcare and Public Health":
        return healthcareRoles;
      case "Education and Training":
        return educationRoles;
      case "Law Enforcement and Security":
        return lawEnforcementRoles;
      case "Social Care and Community Support":
        return socialCareRoles;
      case "Transport and Infrastructure":
        return infrastructureRoles;
      case "Environmental and Sustainability":
        return environmentalRoles;
      case "Regulatory and Compliance":
        return regulatoryRoles;
      case "Public Sector Leadership":
        return leadershipRoles;
      case "Administrative Support":
        return administrativeRoles;
      case "Specialized Public Sector":
        return specializedRoles;
      default:
        return [];
    }
  };

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="publicSectorSpecialization"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Public Sector Specialization</FormLabel>
            <FormControl>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  onSpecializationChange(value);
                }} 
                defaultValue={field.value}
              >
                <SelectTrigger className="w-full bg-white border border-gray-300">
                  <SelectValue placeholder="Select your public sector specialization" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {publicSectorSpecializations.map((specialization) => (
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
              />
            )}
          </FormItem>
        )}
      />
    </div>
  );
};

export default PublicSectorSpecializationSelect;