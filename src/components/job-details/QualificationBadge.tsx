import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Square, X } from "lucide-react";

interface QualificationBadgeProps {
  name: string;
  type: 'essential' | 'desirable';
  onRemove: () => void;
  onToggleType: () => void;
}

const QualificationBadge = ({ name, type, onRemove, onToggleType }: QualificationBadgeProps) => {
  return (
    <Badge 
      variant="secondary"
      className="flex items-center gap-1 py-1 px-2"
    >
      <button
        type="button"
        className="p-0.5 hover:bg-secondary rounded-sm transition-colors"
        onClick={onToggleType}
        aria-label={`Toggle ${name} as ${type === 'essential' ? 'desirable' : 'essential'}`}
      >
        {type === 'essential' ? (
          <CheckSquare className="h-3.5 w-3.5" />
        ) : (
          <Square className="h-3.5 w-3.5" />
        )}
      </button>
      <span className="mx-1">{name}</span>
      <button
        type="button"
        className="p-0.5 hover:bg-secondary rounded-sm transition-colors"
        onClick={onRemove}
        aria-label={`Remove ${name}`}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </Badge>
  );
};

export default QualificationBadge;