import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExternalLink, Lock, Trash2, Clock } from "lucide-react";
import { BoardItem, Stage, STAGES, isStale } from "@/hooks/useJobHuntBoard";

interface Props {
  item: BoardItem;
  onMove: (id: string, stage: Stage) => void;
  onRemove: (id: string) => void;
}

export const JobHuntCard = ({ item, onMove, onRemove }: Props) => {
  const stale = isStale(item);

  return (
    <div className="rounded-2xl border border-border bg-white/5 p-4 backdrop-blur-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-semibold text-foreground">{item.roleTitle}</p>
          <p className="truncate text-sm text-muted-foreground">{item.company}</p>
        </div>
        {item.onJobz ? (
          <Badge variant="secondary" className="shrink-0 gap-1">
            <Lock className="h-3 w-3" /> Jobz
          </Badge>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-muted-foreground"
            onClick={() => onRemove(item.id)}
            aria-label="Remove from board"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span>Applied {format(new Date(item.appliedOn), "d MMM yyyy")}</span>
        {item.source && !item.onJobz && <span>· {item.source}</span>}
        {item.jobUrl && (
          <a
            href={item.jobUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            Advert <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>

      {item.notes && <p className="mt-3 text-sm text-muted-foreground">{item.notes}</p>}

      {stale && (
        <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-primary/15 px-3 py-1 text-xs text-foreground">
          <Clock className="h-3 w-3" /> Chase {item.company}?
        </p>
      )}

      {!item.onJobz && (
        <div className="mt-3">
          <Select value={item.stage} onValueChange={(v) => onMove(item.id, v as Stage)}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STAGES.map((s) => (
                <SelectItem key={s.key} value={s.key}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};
