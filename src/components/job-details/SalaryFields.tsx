
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import SalaryRangeField from "../SalaryRangeField";

interface SalaryFieldsProps {
  control: Control<any>;
}

const SalaryFields = ({ control }: SalaryFieldsProps) => {
  return (
    <>
      <SalaryRangeField control={control} />
      <FormField
        control={control}
        name="actualSalary"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-2">
              <FormLabel>Salary for bonus purposes</FormLabel>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-gray-500" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>If you want to attract candidates or anonymously use recruiters, you'll need to provide a salary figure for calculation purposes.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <FormControl>
              <Input 
                placeholder="Enter salary for bonus calculation..." 
                className="bg-white text-gray-900" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default SalaryFields;
