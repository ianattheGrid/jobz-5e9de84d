import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Briefcase } from "lucide-react";
import { WorkExperienceEntry } from "@/integrations/supabase/types/profiles";
import { ASCENT_CHAR_LIMITS } from "./constants";

interface WorkExperienceBlockProps {
  entries: WorkExperienceEntry[];
  onChange: (entries: WorkExperienceEntry[]) => void;
}

export function WorkExperienceBlock({ entries, onChange }: WorkExperienceBlockProps) {
  const addEntry = () => {
    const newEntry: WorkExperienceEntry = {
      id: crypto.randomUUID(),
      role_title: '',
      organisation_name: '',
      role_start_date: '',
      role_end_date: '',
      role_simple_summary: '',
      role_main_responsibilities: '',
      role_challenge_handled: null,
      role_proud_of: null,
    };
    onChange([...entries, newEntry]);
  };

  const updateEntry = (id: string, field: keyof WorkExperienceEntry, value: string | null) => {
    onChange(entries.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const removeEntry = (id: string) => {
    onChange(entries.filter(e => e.id !== id));
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <span className="text-primary">💼</span> Work Experience
        </h4>
        <p className="text-sm text-muted-foreground">
          Tell us about the jobs you've had so far. Keep it simple and focused on what you actually did.
        </p>
      </div>

      {entries.map((entry, index) => (
        <Card key={entry.id} className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                Role #{index + 1}
              </CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeEntry(entry.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Job Title</label>
                <Input
                  placeholder="e.g., Sales Assistant"
                  value={entry.role_title}
                  onChange={(e) => updateEntry(entry.id, 'role_title', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Organisation</label>
                <Input
                  placeholder="e.g., Tesco"
                  value={entry.organisation_name}
                  onChange={(e) => updateEntry(entry.id, 'organisation_name', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Start Date</label>
                <Input
                  type="month"
                  value={entry.role_start_date}
                  onChange={(e) => updateEntry(entry.id, 'role_start_date', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">End Date</label>
                <Input
                  type="month"
                  placeholder="Leave empty if current"
                  value={entry.role_end_date === 'current' ? '' : entry.role_end_date}
                  onChange={(e) => updateEntry(entry.id, 'role_end_date', e.target.value || 'current')}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">Leave empty if this is your current role</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">In simple terms, what was this job?</label>
              <Input
                placeholder="e.g., Helping customers and managing the till"
                value={entry.role_simple_summary}
                onChange={(e) => updateEntry(entry.id, 'role_simple_summary', e.target.value.slice(0, ASCENT_CHAR_LIMITS.role_simple_summary))}
                maxLength={ASCENT_CHAR_LIMITS.role_simple_summary}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground text-right mt-1">
                {entry.role_simple_summary.length}/{ASCENT_CHAR_LIMITS.role_simple_summary}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Main things I was responsible for</label>
              <Textarea
                placeholder="e.g., Opening/closing the store, training new starters, handling customer queries..."
                value={entry.role_main_responsibilities}
                onChange={(e) => updateEntry(entry.id, 'role_main_responsibilities', e.target.value.slice(0, ASCENT_CHAR_LIMITS.role_main_responsibilities))}
                maxLength={ASCENT_CHAR_LIMITS.role_main_responsibilities}
                className="mt-1 resize-none"
                rows={2}
              />
              <p className="text-xs text-muted-foreground text-right mt-1">
                {entry.role_main_responsibilities.length}/{ASCENT_CHAR_LIMITS.role_main_responsibilities}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">A challenge I handled well (optional)</label>
              <Textarea
                placeholder="e.g., Managed a busy Christmas period with reduced staff..."
                value={entry.role_challenge_handled || ''}
                onChange={(e) => updateEntry(entry.id, 'role_challenge_handled', e.target.value.slice(0, ASCENT_CHAR_LIMITS.role_challenge_handled) || null)}
                maxLength={ASCENT_CHAR_LIMITS.role_challenge_handled}
                className="mt-1 resize-none"
                rows={2}
              />
              <p className="text-xs text-muted-foreground text-right mt-1">
                {(entry.role_challenge_handled || '').length}/{ASCENT_CHAR_LIMITS.role_challenge_handled}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Something I'm proud of from this role (optional)</label>
              <Textarea
                placeholder="e.g., Got promoted to team leader after 6 months..."
                value={entry.role_proud_of || ''}
                onChange={(e) => updateEntry(entry.id, 'role_proud_of', e.target.value.slice(0, ASCENT_CHAR_LIMITS.role_proud_of) || null)}
                maxLength={ASCENT_CHAR_LIMITS.role_proud_of}
                className="mt-1 resize-none"
                rows={2}
              />
              <p className="text-xs text-muted-foreground text-right mt-1">
                {(entry.role_proud_of || '').length}/{ASCENT_CHAR_LIMITS.role_proud_of}
              </p>
            </div>
          </CardContent>
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
