
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Control } from "react-hook-form";
import { JobSearchSchema } from "./JobSearchSchema";
import { bristolPostcodes } from "@/data/bristolPostcodes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface BristolPostcodeSelectProps {
  control: Control<JobSearchSchema>;
}

const BristolPostcodeSelect = ({ control }: BristolPostcodeSelectProps) => {
  return (
    <FormField
      control={control}
      name="location"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between bg-white text-gray-900">
                  {field.value.length === 0 
                    ? "Select postcodes" 
                    : field.value.length === bristolPostcodes.length 
                      ? "All Bristol Areas"
                      : `${field.value.length} area${field.value.length > 1 ? 's' : ''} selected`}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full min-w-[200px]">
                <DropdownMenuCheckboxItem
                  checked={field.value.length === bristolPostcodes.length}
                  onCheckedChange={(checked) => {
                    field.onChange(checked ? bristolPostcodes : []);
                  }}
                >
                  All Bristol Areas
                </DropdownMenuCheckboxItem>
                {bristolPostcodes.map((postcode) => (
                  <DropdownMenuCheckboxItem
                    key={postcode}
                    checked={field.value.includes(postcode)}
                    onCheckedChange={(checked) => {
                      const newValue = checked
                        ? [...field.value, postcode]
                        : field.value.filter((p: string) => p !== postcode);
                      field.onChange(newValue);
                    }}
                  >
                    {postcode}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default BristolPostcodeSelect;
