import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { itQualifications } from "./constants";

interface QualificationSelectorProps {
  selectedQualification: string;
  onSelect: (qualificationName: string) => void;
}

const QualificationSelector = ({ selectedQualification, onSelect }: QualificationSelectorProps) => {
  return (
    <Select onValueChange={onSelect} value={selectedQualification}>
      <SelectTrigger className="w-full bg-white">
        <SelectValue placeholder="Select a qualification" />
      </SelectTrigger>
      <SelectContent className="bg-white max-h-[300px]">
        {itQualifications.map((qualification) => (
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