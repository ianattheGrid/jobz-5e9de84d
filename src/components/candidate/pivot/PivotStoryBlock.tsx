import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Compass, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { 
  PIVOT_TYPE_OPTIONS, 
  SECTOR_OPTIONS, 
  PIVOT_CHAR_LIMITS,
  MAX_TARGET_SECTORS,
  MAX_TARGET_ROLE_TYPES,
} from "./constants";
import { PivotType } from "@/integrations/supabase/types/profiles";

interface PivotStoryBlockProps {
  pivotType: PivotType | null;
  targetSectors: string[];
  targetRoleTypes: string[];
  pivotMotivation: string | null;
  onPivotTypeChange: (value: PivotType | null) => void;
  onTargetSectorsChange: (value: string[]) => void;
  onTargetRoleTypesChange: (value: string[]) => void;
  onPivotMotivationChange: (value: string | null) => void;
}

export function PivotStoryBlock({
  pivotType,
  targetSectors,
  targetRoleTypes,
  pivotMotivation,
  onPivotTypeChange,
  onTargetSectorsChange,
  onTargetRoleTypesChange,
  onPivotMotivationChange,
}: PivotStoryBlockProps) {
  const [newRoleType, setNewRoleType] = useState("");

  const toggleSector = (key: string) => {
    if (targetSectors.includes(key)) {
      onTargetSectorsChange(targetSectors.filter(s => s !== key));
    } else if (targetSectors.length < MAX_TARGET_SECTORS) {
      onTargetSectorsChange([...targetSectors, key]);
    }
  };

  const addRoleType = () => {
    const trimmed = newRoleType.trim();
    if (trimmed && !targetRoleTypes.includes(trimmed) && targetRoleTypes.length < MAX_TARGET_ROLE_TYPES) {
      onTargetRoleTypesChange([...targetRoleTypes, trimmed]);
      setNewRoleType("");
    }
  };

  const removeRoleType = (role: string) => {
    onTargetRoleTypesChange(targetRoleTypes.filter(r => r !== role));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Compass className="h-5 w-5 text-orange-600" />
        <h4 className="text-lg font-semibold text-foreground">My Career Pivot: Where I'm Going Next</h4>
      </div>

      {/* Pivot Type Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Are you looking to change your career direction?</Label>
        <div className="space-y-2">
          {PIVOT_TYPE_OPTIONS.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => onPivotTypeChange(option.key as PivotType)}
              className={cn(
                "w-full text-left p-4 rounded-lg border transition-all",
                pivotType === option.key
                  ? "border-orange-500 bg-orange-500/10"
                  : "border-border hover:border-orange-500/50"
              )}
            >
              <div className="font-medium text-foreground">{option.label}</div>
              <div className="text-sm text-muted-foreground">{option.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Target Sectors */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Which sector(s) are you targeting for your pivot? 
          <span className="text-muted-foreground ml-1">(Select 1-{MAX_TARGET_SECTORS})</span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {SECTOR_OPTIONS.map((sector) => {
            const isSelected = targetSectors.includes(sector.key);
            const isDisabled = !isSelected && targetSectors.length >= MAX_TARGET_SECTORS;
            return (
              <Badge
                key={sector.key}
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-all px-3 py-1.5",
                  isSelected && "bg-orange-500 hover:bg-orange-600",
                  isDisabled && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => !isDisabled && toggleSector(sector.key)}
              >
                {sector.label}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Target Role Types */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          What kind of role(s) are you aiming for?
          <span className="text-muted-foreground ml-1">(Type 1-{MAX_TARGET_ROLE_TYPES})</span>
        </Label>
        <p className="text-xs text-muted-foreground">
          e.g., "Project Manager", "UX Designer", "Marketing Coordinator"
        </p>
        <div className="flex gap-2">
          <Input
            value={newRoleType}
            onChange={(e) => setNewRoleType(e.target.value)}
            placeholder="Type a role and press Add..."
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addRoleType();
              }
            }}
            disabled={targetRoleTypes.length >= MAX_TARGET_ROLE_TYPES}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addRoleType}
            disabled={!newRoleType.trim() || targetRoleTypes.length >= MAX_TARGET_ROLE_TYPES}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {targetRoleTypes.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {targetRoleTypes.map((role) => (
              <Badge key={role} variant="secondary" className="gap-1 pr-1">
                {role}
                <button
                  type="button"
                  onClick={() => removeRoleType(role)}
                  className="ml-1 hover:bg-muted rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Pivot Motivation */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Why this pivot? What excites you about this new direction?
        </Label>
        <p className="text-xs text-muted-foreground">
          In 2-3 sentences, tell us your motivation for making this change.
        </p>
        <Textarea
          value={pivotMotivation || ""}
          onChange={(e) => onPivotMotivationChange(e.target.value || null)}
          placeholder="I've always been passionate about... After 8 years in finance, I realized my favourite part was..."
          className="min-h-[100px] resize-none"
          maxLength={PIVOT_CHAR_LIMITS.pivot_motivation}
        />
        <p className="text-xs text-muted-foreground text-right">
          {(pivotMotivation?.length || 0)}/{PIVOT_CHAR_LIMITS.pivot_motivation}
        </p>
      </div>
    </div>
  );
}
