import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FileText, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { EncoreExperienceEntry } from "@/integrations/supabase/types/profiles";
import { ENCORE_CHAR_LIMITS, MAX_EXPERIENCE_ENTRIES } from "./constants";

interface EncoreExperienceBlockProps {
  entries: EncoreExperienceEntry[];
  onChange: (entries: EncoreExperienceEntry[]) => void;
}

export function EncoreExperienceBlock({
  entries,
  onChange,
}: EncoreExperienceBlockProps) {
  const [isOpen, setIsOpen] = useState(entries.length > 0);

  const addEntry = () => {
    if (entries.length < MAX_EXPERIENCE_ENTRIES) {
      const newEntry: EncoreExperienceEntry = {
        id: crypto.randomUUID(),
        role_title: '',
        organisation_name: '',
        role_start_date: '',
        role_end_date: '',
        role_brief_context: '',
        role_key_impacts: [''],
      };
      onChange([...entries, newEntry]);
    }
  };

  const updateEntry = (index: number, updates: Partial<EncoreExperienceEntry>) => {
    const updated = [...entries];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const removeEntry = (index: number) => {
    onChange(entries.filter((_, i) => i !== index));
  };

  const updateImpact = (entryIndex: number, impactIndex: number, value: string) => {
    const updated = [...entries];
    const impacts = [...(updated[entryIndex].role_key_impacts || [])];
    impacts[impactIndex] = value;
    updated[entryIndex].role_key_impacts = impacts;
    onChange(updated);
  };

  const addImpact = (entryIndex: number) => {
    const entry = entries[entryIndex];
    if ((entry.role_key_impacts?.length || 0) < 2) {
      updateEntry(entryIndex, {
        role_key_impacts: [...(entry.role_key_impacts || []), ''],
      });
    }
  };

  return (
    <div className="space-y-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between cursor-pointer hover:bg-muted/50 p-2 rounded-lg -mx-2">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-amber-600" />
              <div>
                <h4 className="text-lg font-semibold text-foreground">Career Highlights (Optional Detail)</h4>
                <p className="text-sm text-muted-foreground">Add your last few roles for more detail</p>
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
          <div className="space-y-4">
            {entries.map((entry, index) => (
              <Card key={entry.id} className="border border-border">
                <CardContent className="pt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-foreground">Role {index + 1}</h5>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEntry(index)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Job Title</Label>
                      <Input
                        value={entry.role_title}
                        onChange={(e) => updateEntry(index, { role_title: e.target.value })}
                        placeholder="e.g. Regional Manager"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Organisation</Label>
                      <Input
                        value={entry.organisation_name}
                        onChange={(e) => updateEntry(index, { organisation_name: e.target.value })}
                        placeholder="Company name"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        type="month"
                        value={entry.role_start_date}
                        onChange={(e) => updateEntry(index, { role_start_date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input
                        type="month"
                        value={entry.role_end_date === 'Retired / Left' ? '' : entry.role_end_date}
                        onChange={(e) => updateEntry(index, { role_end_date: e.target.value || 'Retired / Left' })}
                        placeholder="Leave blank if retired/left"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Brief Context</Label>
                    <Textarea
                      value={entry.role_brief_context}
                      onChange={(e) => updateEntry(index, { role_brief_context: e.target.value })}
                      maxLength={ENCORE_CHAR_LIMITS.role_brief_context}
                      placeholder="What was the main purpose of this role?"
                      className="min-h-[60px]"
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {entry.role_brief_context.length}/{ENCORE_CHAR_LIMITS.role_brief_context}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label>Key Impacts (1-2)</Label>
                    {(entry.role_key_impacts || ['']).map((impact, impactIndex) => (
                      <div key={impactIndex} className="space-y-1">
                        <Textarea
                          value={impact}
                          onChange={(e) => updateImpact(index, impactIndex, e.target.value)}
                          maxLength={ENCORE_CHAR_LIMITS.role_key_impact}
                          placeholder="A key achievement or improvement..."
                          className="min-h-[60px]"
                        />
                        <p className="text-xs text-muted-foreground text-right">
                          {impact.length}/{ENCORE_CHAR_LIMITS.role_key_impact}
                        </p>
                      </div>
                    ))}
                    {(entry.role_key_impacts?.length || 0) < 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => addImpact(index)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add another impact
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {entries.length < MAX_EXPERIENCE_ENTRIES && (
              <Button
                type="button"
                variant="outline"
                onClick={addEntry}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Role ({entries.length}/{MAX_EXPERIENCE_ENTRIES})
              </Button>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
