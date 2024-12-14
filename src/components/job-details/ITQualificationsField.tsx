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
import { X, CheckSquare, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Qualification {
  name: string;
  type: 'essential' | 'desirable';
}

interface ITQualificationsFieldProps {
  control: Control<any>;
  value: Qualification[];
  onChange: (value: Qualification[]) => void;
}

const ITQualificationsField = ({ control, value, onChange }: ITQualificationsFieldProps) => {
  const handleSelect = (qualificationName: string) => {
    if (!value.find(q => q.name === qualificationName)) {
      onChange([...value, { name: qualificationName, type: 'desirable' }]);
    }
  };

  const handleRemove = (qualificationName: string) => {
    onChange(value.filter(q => q.name !== qualificationName));
  };

  const toggleType = (qualificationName: string) => {
    onChange(value.map(q => 
      q.name === qualificationName 
        ? { ...q, type: q.type === 'essential' ? 'desirable' : 'essential' }
        : q
    ));
  };

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="required_qualifications"
        render={({ field }) => (
          <FormItem>
            <FormLabel>IT Qualifications</FormLabel>
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
                      disabled={value.some(q => q.name === qualification)}
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
                  key={qualification.name} 
                  variant="secondary"
                  className="flex items-center gap-2 pr-1"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 p-0 hover:bg-transparent"
                    onClick={() => toggleType(qualification.name)}
                  >
                    {qualification.type === 'essential' ? (
                      <CheckSquare className="h-4 w-4" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </Button>
                  {qualification.name}
                  <X 
                    className="h-3 w-3 cursor-pointer ml-1" 
                    onClick={() => handleRemove(qualification.name)}
                  />
                </Badge>
              ))}
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              <CheckSquare className="h-4 w-4 inline-block mr-1" /> Essential
              <Square className="h-4 w-4 inline-block ml-3 mr-1" /> Desirable
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ITQualificationsField;