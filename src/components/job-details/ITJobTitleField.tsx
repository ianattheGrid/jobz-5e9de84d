import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Control } from "react-hook-form";

const itJobTitles = [
  { value: "android-developer", label: "Android Developer" },
  { value: "backend-developer", label: "Backend Developer" },
  { value: "business-analyst", label: "Business Analyst" },
  { value: "cloud-architect", label: "Cloud Architect" },
  { value: "data-analyst", label: "Data Analyst" },
  { value: "data-engineer", label: "Data Engineer" },
  { value: "data-scientist", label: "Data Scientist" },
  { value: "database-administrator", label: "Database Administrator" },
  { value: "devops-engineer", label: "DevOps Engineer" },
  { value: "frontend-developer", label: "Frontend Developer" },
  { value: "full-stack-developer", label: "Full Stack Developer" },
  { value: "ios-developer", label: "iOS Developer" },
  { value: "it-consultant", label: "IT Consultant" },
  { value: "it-manager", label: "IT Manager" },
  { value: "it-project-manager", label: "IT Project Manager" },
  { value: "it-support-specialist", label: "IT Support Specialist" },
  { value: "network-administrator", label: "Network Administrator" },
  { value: "network-engineer", label: "Network Engineer" },
  { value: "product-manager", label: "Product Manager" },
  { value: "qa-engineer", label: "QA Engineer" },
  { value: "security-analyst", label: "Security Analyst" },
  { value: "software-architect", label: "Software Architect" },
  { value: "software-engineer", label: "Software Engineer" },
  { value: "systems-administrator", label: "Systems Administrator" },
  { value: "technical-lead", label: "Technical Lead" },
  { value: "ui-designer", label: "UI Designer" },
  { value: "ux-designer", label: "UX Designer" },
  { value: "web-designer", label: "Web Designer" },
  { value: "web-developer", label: "Web Developer" },
].sort((a, b) => a.label.localeCompare(b.label));

interface ITJobTitleFieldProps {
  control: Control<any>;
}

export default function ITJobTitleField({ control }: ITJobTitleFieldProps) {
  const [open, setOpen] = React.useState(false);

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
                    : "Select IT job title..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Search IT job titles..." />
                <CommandEmpty>No job title found.</CommandEmpty>
                <CommandGroup className="max-h-64 overflow-y-auto">
                  {itJobTitles.map((title) => (
                    <CommandItem
                      key={title.value}
                      value={title.value}
                      onSelect={(currentValue) => {
                        field.onChange(currentValue === field.value ? "" : currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          field.value === title.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {title.label}
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
}