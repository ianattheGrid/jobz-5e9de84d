import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { bristolPostcodes } from "@/data/bristolPostcodes";
import { Control } from "react-hook-form";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LocationFieldProps {
  control: Control<any>;
}

const LocationField = ({ control }: LocationFieldProps) => {
  const locationOptions = [
    { value: "All", label: "All Areas" },
    ...bristolPostcodes.map(postcode => ({ value: postcode, label: postcode }))
  ];

  return (
    <FormField
      control={control}
      name="location"
      defaultValue={["All"]}
      render={({ field }) => (
        <FormItem>
          <FormLabel>What locations are you looking to work in (Bristol postcodes only)</FormLabel>
          <FormControl>
            <Command className="border rounded-md">
              <CommandInput placeholder="Search postcodes..." />
              <CommandEmpty>No postcode found.</CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {locationOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      const currentValue = field.value || [];
                      const newValue = currentValue.includes(option.value)
                        ? currentValue.filter((v: string) => v !== option.value)
                        : [...currentValue, option.value];
                      field.onChange(newValue);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        (field.value || []).includes(option.value) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </FormControl>
          <div className="flex flex-wrap gap-2 mt-2">
            {(field.value || []).map((value: string) => (
              <Badge 
                key={value}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => {
                  field.onChange(field.value.filter((v: string) => v !== value));
                }}
              >
                {value} ×
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            You can select multiple postcodes to increase your job match opportunities
          </p>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LocationField;