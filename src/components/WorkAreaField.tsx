import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { useState } from "react";

interface WorkAreaFieldProps {
  control: Control<any>;
}

const workAreas = [
  "R&D",
  "Quality Assurance",
  "Sales",
  "Marketing",
  "Customer Service",
  "IT",
  "Accounting & Finance",
  "Human Resources",
  "Legal",
  "Manufacturing",
  "Energy & Utilities",
  "Pharma",
  "Public Sector",
  "Engineering",
  "Hospitality & Tourism",
  "Other"
];

const itSpecializations = [
  "Software Development and Programming",
  "IT Support and Operations",
  "Networking and Infrastructure",
  "Cybersecurity",
  "Data and Analytics",
  "Cloud Computing",
  "Artificial Intelligence and Machine Learning",
  "Testing and Quality Assurance",
  "IT Management",
  "Specialised IT Roles"
];

const WorkAreaField = ({ control }: WorkAreaFieldProps) => {
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [showITSpecialization, setShowITSpecialization] = useState(false);

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="workArea"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Area of Work</FormLabel>
            <FormControl>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  setShowOtherInput(value === "Other");
                  setShowITSpecialization(value === "IT");
                }} 
                defaultValue={field.value}
              >
                <SelectTrigger className="w-full bg-white border border-gray-300">
                  <SelectValue placeholder="Select the area of work" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {workAreas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {showITSpecialization && (
        <FormField
          control={control}
          name="itSpecialization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>IT Specialization</FormLabel>
              <FormControl>
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full bg-white border border-gray-300">
                    <SelectValue placeholder="Select your IT specialization" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {itSpecializations.map((specialization) => (
                      <SelectItem key={specialization} value={specialization}>
                        {specialization}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {showOtherInput && (
        <FormField
          control={control}
          name="otherWorkArea"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Please specify the area of work</FormLabel>
              <FormControl>
                <Input placeholder="Enter the area of work..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default WorkAreaField;