import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Square, X } from "lucide-react";

interface QualificationBadgeProps {
  name: string;
  type: 'essential' | 'desirable';
  onRemove: (e: React.MouseEvent) => void;
  onToggleType: (e: React.MouseEvent) => void;
}

const QualificationBadge = ({ name, type, onRemove, onToggleType }: QualificationBadgeProps) => {
  return (
    <Badge 
      variant="secondary"
      className="flex items-center gap-2 pr-1"
    >
      <Button
        variant="ghost"
        size="sm"
        className="h-4 p-0 hover:bg-transparent"
        onClick={onToggleType}
        type="button"
        aria-label={`Toggle ${name} as ${type === 'essential' ? 'desirable' : 'essential'}`}
      >
        {type === 'essential' ? (
          <CheckSquare className="h-4 w-4" />
        ) : (
          <Square className="h-4 w-4" />
        )}
      </Button>
      {name}
      <Button
        variant="ghost"
        size="sm"
        className="h-4 w-4 p-0 hover:bg-transparent ml-1"
        onClick={onRemove}
        type="button"
        aria-label={`Remove ${name}`}
      >
        <X className="h-3 w-3" />
      </Button>
    </Badge>
  );
};

export default QualificationBadge;