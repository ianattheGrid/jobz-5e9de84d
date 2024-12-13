import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Control } from "react-hook-form";

interface ITJobTitle {
  label: string;
  value: string;
}

interface ITJobTitleFieldProps {
  control: Control<any>;
}

const itJobTitles: ITJobTitle[] = [
  { label: "Backend Developer", value: "Backend Developer" },
  { label: "Cloud Architect", value: "Cloud Architect" },
  { label: "Data Analyst", value: "Data Analyst" },
  { label: "Database Administrator", value: "Database Administrator" },
  { label: "DevOps Engineer", value: "DevOps Engineer" },
  { label: "Frontend Developer", value: "Frontend Developer" },
  { label: "Full Stack Developer", value: "Full Stack Developer" },
  { label: "IT Support Specialist", value: "IT Support Specialist" },
  { label: "Mobile Developer", value: "Mobile Developer" },
  { label: "Network Engineer", value: "Network Engineer" },
  { label: "Security Engineer", value: "Security Engineer" },
  { label: "Software Engineer", value: "Software Engineer" },
  { label: "Systems Administrator", value: "Systems Administrator" },
  { label: "UI/UX Designer", value: "UI/UX Designer" },
  { label: "Web Developer", value: "Web Developer" },
  { label: "Web Designer", value: "Web Designer" },
].sort((a, b) => a.label.localeCompare(b.label));

const ITJobTitleField = ({ control }: ITJobTitleFieldProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const filteredTitles = searchValue === "" 
    ? [] 
    : itJobTitles.filter(title => 
        title.label.toLowerCase().includes(searchValue.toLowerCase())
      );

  return (
    <FormField
      control={control}
      name="title"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Job Title</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? itJobTitles.find((title) => title.value === field.value)?.label
                    : "Select an IT job title"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent 
              className="w-full p-0 bg-white shadow-lg border border-gray-200" 
              align="start"
            >
              <Command className="bg-white">
                <CommandInput 
                  placeholder="Search IT job titles..." 
                  value={searchValue}
                  onValueChange={handleSearch}
                  className="border-none focus:ring-0"
                />
                <div className="bg-white">
                  {searchValue === "" ? (
                    <CommandEmpty className="py-6 text-sm text-gray-500">
                      Start typing to search for job titles...
                    </CommandEmpty>
                  ) : filteredTitles.length === 0 ? (
                    <CommandEmpty className="py-6 text-sm text-gray-500">
                      No job title found.
                    </CommandEmpty>
                  ) : (
                    <CommandGroup className="max-h-[200px] overflow-y-auto bg-white">
                      {filteredTitles.map((title) => (
                        <CommandItem
                          key={title.value}
                          value={title.value}
                          onSelect={() => {
                            field.onChange(title.value);
                            setOpen(false);
                            setSearchValue("");
                          }}
                          className="cursor-pointer hover:bg-gray-100"
                        >
                          {title.label}
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              field.value === title.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </div>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ITJobTitleField;