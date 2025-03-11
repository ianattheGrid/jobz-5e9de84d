
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";
import { CandidateFormValues } from "../candidate/candidateFormSchema";
import { bristolPostcodes } from "@/data/bristolPostcodes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BristolPostcodeSelectProps {
  control: Control<CandidateFormValues>;
}

const BristolPostcodeSelect = ({ control }: BristolPostcodeSelectProps) => {
  return (
    <FormField
      control={control}
      name="location"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-900">What Bristol locations are you willing to work in?</FormLabel>
          <FormControl>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-between bg-white text-gray-900 h-auto min-h-10 py-2 border-gray-200"
                >
                  <div className="flex flex-wrap gap-1 items-center">
                    {(!field.value || field.value.length === 0) && <span>Select postcodes</span>}
                    {field.value?.length === bristolPostcodes.length && <span>All Bristol Areas</span>}
                    {field.value?.length > 0 && field.value?.length < bristolPostcodes.length && (
                      field.value.map((postcode: string) => (
                        <span 
                          key={postcode}
                          className="bg-primary/10 text-primary rounded-md px-2 py-0.5 text-sm"
                        >
                          {postcode}
                        </span>
                      ))
                    )}
                  </div>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-[200px] bg-white border border-gray-200 shadow-md"
                align="start"
                side="bottom"
              >
                <ScrollArea className="h-[300px] w-full p-2">
                  <DropdownMenuCheckboxItem
                    className="cursor-pointer rounded-md mb-2 text-gray-900 hover:bg-gray-100"
                    checked={field.value?.length === bristolPostcodes.length}
                    onCheckedChange={(checked) => {
                      field.onChange(checked ? bristolPostcodes : []);
                    }}
                  >
                    <span className="flex items-center font-medium">
                      All Bristol Areas
                    </span>
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  {bristolPostcodes.map((postcode) => (
                    <DropdownMenuCheckboxItem
                      key={postcode}
                      className="cursor-pointer rounded-md text-gray-900 hover:bg-gray-100 my-1"
                      checked={field.value?.includes(postcode)}
                      onCheckedChange={(checked) => {
                        const newValue = checked
                          ? [...(field.value || []), postcode]
                          : (field.value || []).filter((p: string) => p !== postcode);
                        field.onChange(newValue);
                      }}
                    >
                      <span className="flex items-center">
                        {postcode}
                      </span>
                    </DropdownMenuCheckboxItem>
                  ))}
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>
          </FormControl>
          <p className="text-sm text-gray-600 mt-1">
            Select the Bristol areas where you are willing to work
          </p>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BristolPostcodeSelect;
