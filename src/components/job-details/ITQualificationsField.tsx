import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { itQualifications } from "./constants";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface ITQualificationsFieldProps {
  control: Control<any>;
  value: string[];
  onChange: (value: string[]) => void;
}

const ITQualificationsField = ({ control, value, onChange }: ITQualificationsFieldProps) => {
  const handleSelect = (qualification: string) => {
    if (!value.includes(qualification)) {
      onChange([...value, qualification]);
    }
  };

  const handleRemove = (qualification: string) => {
    onChange(value.filter(q => q !== qualification));
  };

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="required_qualifications"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Required IT Qualifications</FormLabel>
            <FormControl>
              <Select onValueChange={handleSelect}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select required qualifications" />
                </SelectTrigger>
                <SelectContent className="bg-white max-h-[300px]">
                  {itQualifications.map((qualification) => (
                    <SelectItem 
                      key={qualification} 
                      value={qualification}
                      disabled={value.includes(qualification)}
                    >
                      {qualification}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <div className="flex flex-wrap gap-2 mt-2">
              {value.map((qualification) => (
                <Badge 
                  key={qualification} 
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {qualification}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleRemove(qualification)}
                  />
                </Badge>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ITQualificationsField;