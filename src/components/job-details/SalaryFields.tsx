
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";
import SalaryRangeField from "../SalaryRangeField";

interface SalaryFieldsProps {
  control: Control<any>;
}

const SalaryFields = ({ control }: SalaryFieldsProps) => {
  return <SalaryRangeField control={control} />;
};

export default SalaryFields;
