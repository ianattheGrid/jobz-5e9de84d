import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Briefcase, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { PivotExperienceEntry } from "@/integrations/supabase/types/profiles";
import { PIVOT_CHAR_LIMITS, MAX_JOURNEY_ROLES, MAX_ACHIEVEMENTS_PER_ROLE } from "./constants";

interface PivotJourneyBlockProps {
  entries: PivotExperienceEntry[];
  onChange: (entries: PivotExperienceEntry[]) => void;
}

const createEmptyEntry = (): PivotExperienceEntry => ({
  id: crypto.randomUUID(),
  role_title: "",
  organisation_name: "",
  role_start_date: "",
  role_end_date: "",
  role_brief_context: "",
  role_key_achievements_transferable: [""],
});

export function PivotJourneyBlock({ entries, onChange }: PivotJourneyBlockProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    entries.length > 0 ? entries[0].id : null
  );

  const addEntry = () => {
    if (entries.length < MAX_JOURNEY_ROLES) {
      const newEntry = createEmptyEntry();
      onChange([...entries, newEntry]);
      setExpandedId(newEntry.id);
    }
  };

  const updateEntry = (id: string, updates: Partial<PivotExperienceEntry>) => {
    onChange(entries.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const removeEntry = (id: string) => {
    onChange(entries.filter(e => e.id !== id));
    if (expandedId === id) {
      setExpandedId(entries.find(e => e.id !== id)?.id || null);
    }
  };

  const updateAchievement = (entryId: string, index: number, value: string) => {
    const entry = entries.find(e => e.id === entryId);
    if (entry) {
      const achievements = [...(entry.role_key_achievements_transferable || [])];
      achievements[index] = value;
      updateEntry(entryId, { role_key_achievements_transferable: achievements });
    }
  };

  const addAchievement = (entryId: string) => {
    const entry = entries.find(e => e.id === entryId);
    if (entry && (entry.role_key_achievements_transferable?.length || 0) < MAX_ACHIEVEMENTS_PER_ROLE) {
      updateEntry(entryId, {
        role_key_achievements_transferable: [...(entry.role_key_achievements_transferable || []), ""]
      });
    }
  };

  const removeAchievement = (entryId: string, index: number) => {
    const entry = entries.find(e => e.id === entryId);
    if (entry) {
      updateEntry(entryId, {
        role_key_achievements_transferable: entry.role_key_achievements_transferable.filter((_, i) => i !== index)
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Briefcase className="h-5 w-5 text-orange-600" />
        <h4 className="text-lg font-semibold text-foreground">My Professional Journey: Where I'm Coming From</h4>
      </div>

      <p className="text-sm text-muted-foreground">
        List your last 2-3 significant roles. Focus on the main purpose and 1-2 achievements that highlight skills you can transfer to your new direction.
      </p>

      <div className="space-y-4">
        {entries.map((entry, index) => (
          <Card key={entry.id} className="border border-border">
            <Collapsible open={expandedId === entry.id} onOpenChange={() => setExpandedId(expandedId === entry.id ? null : entry.id)}>
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                    <div>
                      <p className="font-medium text-foreground">
                        {entry.role_title || "New Role"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {entry.organisation_name || "Organisation"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={(e) => { e.stopPropagation(); removeEntry(entry.id); }}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {expandedId === entry.id ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <CardContent className="pt-0 space-y-4">
                  {/* Role Title & Organisation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Role Title</Label>
                      <Input
                        value={entry.role_title}
                        onChange={(e) => updateEntry(entry.id, { role_title: e.target.value })}
                        placeholder="e.g., Senior Account Manager"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Organisation</Label>
                      <Input
                        value={entry.organisation_name}
                        onChange={(e) => updateEntry(entry.id, { organisation_name: e.target.value })}
                        placeholder="e.g., ABC Company"
                      />
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Start Date</Label>
                      <Input
                        type="month"
                        value={entry.role_start_date}
                        onChange={(e) => updateEntry(entry.id, { role_start_date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">End Date</Label>
                      <Input
                        type="month"
                        value={entry.role_end_date === 'current' ? '' : entry.role_end_date}
                        onChange={(e) => updateEntry(entry.id, { role_end_date: e.target.value || 'current' })}
                        placeholder="Leave blank if current"
                      />
                    </div>
                  </div>

                  {/* Brief Context */}
                  <div className="space-y-2">
                    <Label className="text-sm">Brief Context - What was this job for?</Label>
                    <Textarea
                      value={entry.role_brief_context}
                      onChange={(e) => updateEntry(entry.id, { role_brief_context: e.target.value })}
                      placeholder="Briefly describe the main purpose of this role..."
                      className="min-h-[60px] resize-none"
                      maxLength={PIVOT_CHAR_LIMITS.role_brief_context}
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {entry.role_brief_context.length}/{PIVOT_CHAR_LIMITS.role_brief_context}
                    </p>
                  </div>

                  {/* Transferable Achievements */}
                  <div className="space-y-3">
                    <Label className="text-sm">
                      Key Achievements (Transferable Skills)
                      <span className="text-muted-foreground ml-1">(1-{MAX_ACHIEVEMENTS_PER_ROLE})</span>
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Highlight achievements that show skills relevant to your pivot
                    </p>
                    
                    {entry.role_key_achievements_transferable.map((achievement, aIndex) => (
                      <div key={aIndex} className="flex gap-2">
                        <Input
                          value={achievement}
                          onChange={(e) => updateAchievement(entry.id, aIndex, e.target.value)}
                          placeholder={`Achievement ${aIndex + 1}...`}
                          maxLength={PIVOT_CHAR_LIMITS.role_achievement}
                        />
                        {entry.role_key_achievements_transferable.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeAchievement(entry.id, aIndex)}
                            className="text-muted-foreground hover:text-destructive shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}

                    {entry.role_key_achievements_transferable.length < MAX_ACHIEVEMENTS_PER_ROLE && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addAchievement(entry.id)}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add Achievement
                      </Button>
                    )}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>

      {entries.length < MAX_JOURNEY_ROLES && (
        <Button
          type="button"
          variant="outline"
          onClick={addEntry}
          className="w-full gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Role ({entries.length}/{MAX_JOURNEY_ROLES})
        </Button>
      )}
    </div>
  );
}
