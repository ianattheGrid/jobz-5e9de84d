
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { salesSpecializations, salesRoles } from "../constants/sales-roles";
import JobTitleSelect from "../JobTitleSelect";

interface SalesSpecializationSelectProps {
  control: Control<any>;
  onSpecializationChange: (value: string) => void;
}

const SalesSpecializationSelect = ({ control, onSpecializationChange }: SalesSpecializationSelectProps) => {
  const getTitlesForSpecialization = (specialization: string) => {
    const {
      accountManagementTitles,
      businessDevelopmentTitles,
      insideSalesTitles,
      fieldSalesTitles,
      salesManagementTitles,
      technicalSalesTitles,
      enterpriseSalesTitles,
      channelSalesTitles,
      retailSalesTitles,
      salesOperationsTitles
    } = salesRoles;

    switch (specialization) {
      case "Account Management":
        return accountManagementTitles;
      case "Business Development":
        return businessDevelopmentTitles;
      case "Inside Sales":
        return insideSalesTitles;
      case "Field Sales":
        return fieldSalesTitles;
      case "Sales Management":
        return salesManagementTitles;
      case "Technical Sales":
        return technicalSalesTitles;
      case "Enterprise Sales":
        return enterpriseSalesTitles;
      case "Channel Sales":
        return channelSalesTitles;
      case "Retail Sales":
        return retailSalesTitles;
      case "Sales Operations":
        return salesOperationsTitles;
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
            <FormLabel className="text-gray-900">Sales Specialization</FormLabel>
            <FormControl>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  onSpecializationChange(value);
                }}
                value={field.value}
              >
                <SelectTrigger className="w-full bg-white border border-gray-300">
                  <SelectValue placeholder="Select your sales specialization" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {salesSpecializations.map((specialization) => (
                    <SelectItem key={specialization} value={specialization}>
                      {specialization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
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

export default SalesSpecializationSelect;
