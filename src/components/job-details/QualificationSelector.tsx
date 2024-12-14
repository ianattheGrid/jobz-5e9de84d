import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { itQualifications } from "./constants";

interface QualificationSelectorProps {
  selectedQualifications: string[];
  onSelect: (qualificationName: string) => void;
}

const QualificationSelector = ({ selectedQualifications, onSelect }: QualificationSelectorProps) => {
  return (
    <Select onValueChange={onSelect}>
      <SelectTrigger className="w-full bg-white">
        <SelectValue placeholder="Select required qualifications" />
      </SelectTrigger>
      <SelectContent className="bg-white max-h-[300px]">
        {itQualifications
          .filter(qualification => !selectedQualifications.includes(qualification))
          .map((qualification) => (
            <SelectItem 
              key={qualification} 
              value={qualification}
            >
              {qualification}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};

export default QualificationSelector;