import { useState } from "react";
import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ITJobTitleFieldProps {
  control: Control<any>;
}

const itJobTitles = [
  "AI Engineer",
  "Android Developer",
  "Application Support Engineer",
  "Backend Developer",
  "Business Analyst",
  "Cloud Architect",
  "Cloud Engineer",
  "Data Analyst",
  "Data Engineer",
  "Data Scientist",
  "Database Administrator",
  "DevOps Engineer",
  "Frontend Developer",
  "Full Stack Developer",
  "Information Security Analyst",
  "iOS Developer",
  "IT Project Manager",
  "IT Support Specialist",
  "Java Developer",
  "Machine Learning Engineer",
  "Mobile Developer",
  "Network Administrator",
  "Network Engineer",
  "PHP Developer",
  "Python Developer",
  "Quality Assurance Engineer",
  "React Developer",
  "Ruby Developer",
  "Scrum Master",
  "Software Architect",
  "Software Developer",
  "Software Engineer",
  "Solutions Architect",
  "Systems Administrator",
  "Systems Analyst",
  "Technical Lead",
  "UI Designer",
  "UX Designer",
  "Web Designer",
  "Web Developer"
].sort();

const ITJobTitleField = ({ control }: ITJobTitleFieldProps) => {
  const [open, setOpen] = useState(false);

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
                  {field.value || "Select job title..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search job title..." />
                <CommandEmpty>No job title found.</CommandEmpty>
                <CommandGroup className="max-h-64 overflow-y-auto">
                  {itJobTitles.map((title) => (
                    <CommandItem
                      key={title}
                      value={title}
                      onSelect={() => {
                        field.onChange(title);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          field.value === title ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {title}
                    </CommandItem>
                  ))}
                </CommandGroup>
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