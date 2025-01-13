import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import JobTitleSelect from "../JobTitleSelect";
import { hospitalityRoles } from "../constants/hospitality";

interface HospitalitySpecializationSelectProps {
  control: Control<any>;
  onSpecializationChange: (value: string) => void;
}

const HospitalitySpecializationSelect = ({ control, onSpecializationChange }: HospitalitySpecializationSelectProps) => {
  const specializations = [
    "Hotel and Accommodation",
    "Food and Beverage",
    "Tourism and Travel",
    "Event Management",
    "Marketing and Sales",
    "Customer Service",
    "Operations and Facilities",
    "Luxury Services",
    "Sustainability",
    "Leadership"
  ];

  const getTitlesForSpecialization = (specialization: string) => {
    switch (specialization) {
      case "Hotel and Accommodation":
        return hospitalityRoles.accommodationRoles;
      case "Food and Beverage":
        return hospitalityRoles.foodAndBeverageRoles;
      case "Tourism and Travel":
        return hospitalityRoles.tourismRoles;
      case "Event Management":
        return hospitalityRoles.eventManagementRoles;
      case "Marketing and Sales":
        return hospitalityRoles.hospitalityMarketingRoles;
      case "Customer Service":
        return hospitalityRoles.customerServiceRoles;
      case "Operations and Facilities":
        return hospitalityRoles.operationsRoles;
      case "Luxury Services":
        return hospitalityRoles.luxuryRoles;
      case "Sustainability":
        return hospitalityRoles.sustainabilityRoles;
      case "Leadership":
        return hospitalityRoles.leadershipRoles;
      default:
        return [];
    }
  };

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="hospitality_specialization"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hospitality & Tourism Specialization</FormLabel>
            <FormControl>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  onSpecializationChange(value);
                }}
                defaultValue={field.value}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select your specialization" />
                </SelectTrigger>
                <SelectContent>
                  {specializations.map((specialization) => (
                    <SelectItem key={specialization} value={specialization}>
                      {specialization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {control._formValues.hospitality_specialization && (
        <JobTitleSelect
          control={control}
          titles={getTitlesForSpecialization(control._formValues.hospitality_specialization)}
          name="title"
        />
      )}
    </div>
  );
};

export default HospitalitySpecializationSelect;