import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";
import { CheckSquare, Square } from "lucide-react";
import QualificationBadge from "./QualificationBadge";
import QualificationSelector from "./QualificationSelector";

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

  const handleRemove = (e: React.MouseEvent, qualificationName: string) => {
    e.stopPropagation();
    onChange(value.filter(q => q.name !== qualificationName));
  };

  const toggleType = (e: React.MouseEvent, qualificationName: string) => {
    e.stopPropagation();
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
              <QualificationSelector
                selectedQualifications={value.map(q => q.name)}
                onSelect={handleSelect}
              />
            </FormControl>
            <div className="flex flex-wrap gap-2 mt-2">
              {value.map((qualification) => (
                <QualificationBadge
                  key={qualification.name}
                  name={qualification.name}
                  type={qualification.type}
                  onRemove={(e) => handleRemove(e, qualification.name)}
                  onToggleType={(e) => toggleType(e, qualification.name)}
                />
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