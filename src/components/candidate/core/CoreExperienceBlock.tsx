import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Plus, Trash2, Briefcase, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { CoreExperienceEntry } from "@/integrations/supabase/types/profiles";
import { CORE_CHAR_LIMITS, MAX_KEY_IMPACTS, MIN_KEY_IMPACTS } from "./constants";

interface CoreExperienceBlockProps {
  entries: CoreExperienceEntry[];
  onChange: (entries: CoreExperienceEntry[]) => void;
}

export function CoreExperienceBlock({ entries, onChange }: CoreExperienceBlockProps) {
  const [openEntries, setOpenEntries] = useState<Record<string, boolean>>({});

  const addEntry = () => {
    const newEntry: CoreExperienceEntry = {
      id: crypto.randomUUID(),
      role_title: '',
      organisation_name: '',
      role_start_date: '',
      role_end_date: '',
      role_summary: '',
      role_team_size: null,
      role_budget_responsibility: null,
      role_scope: null,
      role_key_impacts: ['', ''],
    };
    onChange([...entries, newEntry]);
    setOpenEntries({ ...openEntries, [newEntry.id]: true });
  };

  const updateEntry = (id: string, field: keyof CoreExperienceEntry, value: any) => {
    onChange(entries.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const updateImpact = (entryId: string, index: number, value: string) => {
    const entry = entries.find(e => e.id === entryId);
    if (!entry) return;
    const impacts = [...entry.role_key_impacts];
    impacts[index] = value.slice(0, CORE_CHAR_LIMITS.role_key_impact);
    updateEntry(entryId, 'role_key_impacts', impacts);
  };

  const addImpact = (entryId: string) => {
    const entry = entries.find(e => e.id === entryId);
    if (!entry || entry.role_key_impacts.length >= MAX_KEY_IMPACTS) return;
    updateEntry(entryId, 'role_key_impacts', [...entry.role_key_impacts, '']);
  };

  const removeImpact = (entryId: string, index: number) => {
    const entry = entries.find(e => e.id === entryId);
    if (!entry || entry.role_key_impacts.length <= MIN_KEY_IMPACTS) return;
    const impacts = entry.role_key_impacts.filter((_, i) => i !== index);
    updateEntry(entryId, 'role_key_impacts', impacts);
  };

  const removeEntry = (id: string) => {
    onChange(entries.filter(e => e.id !== id));
  };

  const toggleEntry = (id: string) => {
    setOpenEntries({ ...openEntries, [id]: !openEntries[id] });
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <span className="text-primary">💼</span> Experience
        </h4>
        <p className="text-sm text-muted-foreground">
          Add your recent roles. Focus on what changed or improved, not just what was on the job description.
        </p>
      </div>

      {entries.map((entry, index) => (
        <Card key={entry.id} className="relative">
          <Collapsible open={openEntries[entry.id]} onOpenChange={() => toggleEntry(entry.id)}>
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    {entry.role_title || entry.organisation_name 
                      ? `${entry.role_title || 'Role'} – ${entry.organisation_name || 'Company'}`
                      : `Role #${index + 1}`
                    }
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); removeEntry(entry.id); }}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {openEntries[entry.id] ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardHeader>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <CardContent className="space-y-4">
                {/* Basic info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Job title</label>
                    <Input
                      placeholder="e.g., Store Manager"
                      value={entry.role_title}
                      onChange={(e) => updateEntry(entry.id, 'role_title', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Organisation</label>
                    <Input
                      placeholder="e.g., XYZ Retail"
                      value={entry.organisation_name}
                      onChange={(e) => updateEntry(entry.id, 'organisation_name', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Start date</label>
                    <Input
                      type="month"
                      value={entry.role_start_date}
                      onChange={(e) => updateEntry(entry.id, 'role_start_date', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">End date</label>
                    <Input
                      type="month"
                      value={entry.role_end_date === 'current' ? '' : entry.role_end_date}
                      onChange={(e) => updateEntry(entry.id, 'role_end_date', e.target.value || 'current')}
                      placeholder="Current"
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Leave blank if current</p>
                  </div>
                </div>

                {/* Role summary */}
                <div>
                  <label className="text-sm font-medium text-foreground">
                    In simple terms, what was this job for?
                  </label>
                  <Textarea
                    placeholder="e.g., Responsible for day-to-day running and performance of the flagship store."
                    value={entry.role_summary}
                    onChange={(e) => updateEntry(entry.id, 'role_summary', e.target.value.slice(0, CORE_CHAR_LIMITS.role_summary))}
                    maxLength={CORE_CHAR_LIMITS.role_summary}
                    className="mt-1 resize-none"
                    rows={2}
                  />
                  <p className="text-xs text-muted-foreground text-right mt-1">
                    {entry.role_summary.length}/{CORE_CHAR_LIMITS.role_summary}
                  </p>
                </div>

                {/* Scope (optional) */}
                <div className="bg-muted/30 rounded-lg p-4 space-y-4">
                  <p className="text-sm font-medium text-foreground">Scope (optional)</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Team size</label>
                      <Input
                        placeholder="e.g., Managed 8-10 staff"
                        value={entry.role_team_size || ''}
                        onChange={(e) => updateEntry(entry.id, 'role_team_size', e.target.value.slice(0, CORE_CHAR_LIMITS.role_team_size) || null)}
                        maxLength={CORE_CHAR_LIMITS.role_team_size}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Budget responsibility</label>
                      <Input
                        placeholder="e.g., ~£200k annual budget"
                        value={entry.role_budget_responsibility || ''}
                        onChange={(e) => updateEntry(entry.id, 'role_budget_responsibility', e.target.value.slice(0, CORE_CHAR_LIMITS.role_budget_responsibility) || null)}
                        maxLength={CORE_CHAR_LIMITS.role_budget_responsibility}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Geographic scope</label>
                      <Input
                        placeholder="e.g., Regional (North West)"
                        value={entry.role_scope || ''}
                        onChange={(e) => updateEntry(entry.id, 'role_scope', e.target.value.slice(0, CORE_CHAR_LIMITS.role_scope) || null)}
                        maxLength={CORE_CHAR_LIMITS.role_scope}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Key Impacts */}
                <div>
                  <label className="text-sm font-medium text-foreground">
                    What got better because you were there? ({MIN_KEY_IMPACTS}-{MAX_KEY_IMPACTS} impacts)
                  </label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Focus on results: "Reduced…", "Improved…", "Introduced…"
                  </p>
                  <div className="space-y-2">
                    {entry.role_key_impacts.map((impact, i) => (
                      <div key={i} className="flex gap-2">
                        <Input
                          placeholder={`e.g., Improved stock accuracy from 85% to 97%`}
                          value={impact}
                          onChange={(e) => updateImpact(entry.id, i, e.target.value)}
                          maxLength={CORE_CHAR_LIMITS.role_key_impact}
                        />
                        {entry.role_key_impacts.length > MIN_KEY_IMPACTS && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeImpact(entry.id, i)}
                            className="text-destructive hover:text-destructive shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  {entry.role_key_impacts.length < MAX_KEY_IMPACTS && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => addImpact(entry.id)}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add impact
                    </Button>
                  )}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addEntry}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Role
      </Button>
    </div>
  );
}
