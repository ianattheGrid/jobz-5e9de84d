
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";
import { CandidateFormValues } from "@/components/candidate/candidateFormSchema";
import { bristolPostcodes } from "@/data/bristolPostcodes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Check } from "lucide-react";
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
          <FormControl>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-between bg-white text-gray-900 h-auto min-h-10 py-2"
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
                className="w-[200px] bg-white"
                align="start"
                side="bottom"
              >
                <ScrollArea className="h-[300px] w-full p-2">
                  <DropdownMenuCheckboxItem
                    className="cursor-pointer rounded-md mb-2"
                    checked={field.value?.length === bristolPostcodes.length}
                    onCheckedChange={(checked) => {
                      field.onChange(checked ? bristolPostcodes : []);
                    }}
                  >
                    <span className="flex items-center">
                      All Bristol Areas
                    </span>
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSeparator />
                  {bristolPostcodes.map((postcode) => (
                    <DropdownMenuCheckboxItem
                      key={postcode}
                      className="cursor-pointer rounded-md"
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
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BristolPostcodeSelect;
