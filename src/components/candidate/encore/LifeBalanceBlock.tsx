import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Scale, ChevronDown, ChevronUp } from "lucide-react";
import { ENCORE_CHAR_LIMITS } from "./constants";

interface LifeBalanceBlockProps {
  notes: string | null;
  onChange: (notes: string | null) => void;
}

export function LifeBalanceBlock({
  notes,
  onChange,
}: LifeBalanceBlockProps) {
  const [isOpen, setIsOpen] = useState(!!notes);

  return (
    <div className="space-y-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between cursor-pointer hover:bg-muted/50 p-2 rounded-lg -mx-2">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-amber-600" />
              <div>
                <h4 className="text-lg font-semibold text-foreground">Life Balance & Practical Notes (Optional)</h4>
                <p className="text-sm text-muted-foreground">Share practical considerations about your availability</p>
              </div>
            </div>
            {isOpen ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="pt-4">
          <div className="space-y-2">
            <Label htmlFor="life-balance" className="text-base font-medium">
              Anything practical that matters about how work fits into your life now?
            </Label>
            <p className="text-sm text-muted-foreground">
              e.g. caring responsibilities, can't do late nights, prefer not to travel far, etc.
            </p>
            <Textarea
              id="life-balance"
              value={notes || ''}
              onChange={(e) => onChange(e.target.value || null)}
              maxLength={ENCORE_CHAR_LIMITS.life_balance_notes}
              placeholder="Share any practical considerations..."
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground text-right">
              {(notes?.length || 0)}/{ENCORE_CHAR_LIMITS.life_balance_notes}
            </p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
