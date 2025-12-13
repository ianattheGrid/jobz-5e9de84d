import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { HobbyEntry } from "@/integrations/supabase/types/profiles";
import { HOBBY_OPTIONS } from "../getting-started/constants";
import { ASCENT_CHAR_LIMITS } from "./constants";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface AboutMeShortBlockProps {
  aboutMe: string | null;
  outsideWorkProudOf: string | null;
  hobbyEntries: HobbyEntry[];
  onAboutMeChange: (text: string | null) => void;
  onOutsideWorkChange: (text: string | null) => void;
  onHobbyEntriesChange: (entries: HobbyEntry[]) => void;
}

export function AboutMeShortBlock({
  aboutMe,
  outsideWorkProudOf,
  hobbyEntries,
  onAboutMeChange,
  onOutsideWorkChange,
  onHobbyEntriesChange,
}: AboutMeShortBlockProps) {
  const [expandedHobbies, setExpandedHobbies] = useState<string[]>([]);

  const isHobbySelected = (key: string) => hobbyEntries.some(h => h.hobby_type === key);

  const handleHobbyToggle = (key: string) => {
    if (isHobbySelected(key)) {
      onHobbyEntriesChange(hobbyEntries.filter(h => h.hobby_type !== key));
      setExpandedHobbies(expandedHobbies.filter(k => k !== key));
    } else {
      const newEntry: HobbyEntry = {
        id: crypto.randomUUID(),
        hobby_type: key,
        hobby_detail: null,
        skills_demonstrated: null,
      };
      onHobbyEntriesChange([...hobbyEntries, newEntry]);
      setExpandedHobbies([...expandedHobbies, key]);
    }
  };

  const updateHobbyEntry = (hobbyType: string, field: keyof HobbyEntry, value: string | null) => {
    onHobbyEntriesChange(
      hobbyEntries.map(h => h.hobby_type === hobbyType ? { ...h, [field]: value } : h)
    );
  };

  const toggleExpanded = (key: string) => {
    if (expandedHobbies.includes(key)) {
      setExpandedHobbies(expandedHobbies.filter(k => k !== key));
    } else {
      setExpandedHobbies([...expandedHobbies, key]);
    }
  };

  const getHobbyLabel = (key: string) => {
    return HOBBY_OPTIONS.find(h => h.key === key)?.label || key;
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <span className="text-primary">👤</span> About Me & Life Outside Work
        </h4>
        <p className="text-sm text-muted-foreground">
          Keep you human without overloading the profile
        </p>
      </div>

      {/* About me short */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Tell us a bit about you in a sentence or two
        </label>
        <Textarea
          placeholder="e.g., I'm a curious, organised person who likes variety and learning new things..."
          value={aboutMe || ''}
          onChange={(e) => onAboutMeChange(e.target.value.slice(0, ASCENT_CHAR_LIMITS.about_me_short) || null)}
          maxLength={ASCENT_CHAR_LIMITS.about_me_short}
          className="resize-none"
          rows={2}
        />
        <p className="text-xs text-muted-foreground text-right">
          {(aboutMe || '').length}/{ASCENT_CHAR_LIMITS.about_me_short}
        </p>
      </div>

      {/* Outside work proud of */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          One thing outside of work you're proud of (optional)
        </label>
        <Textarea
          placeholder="e.g., Completed a half-marathon, learned to code, started a podcast..."
          value={outsideWorkProudOf || ''}
          onChange={(e) => onOutsideWorkChange(e.target.value.slice(0, ASCENT_CHAR_LIMITS.outside_work_proud_of) || null)}
          maxLength={ASCENT_CHAR_LIMITS.outside_work_proud_of}
          className="resize-none"
          rows={2}
        />
        <p className="text-xs text-muted-foreground text-right">
          {(outsideWorkProudOf || '').length}/{ASCENT_CHAR_LIMITS.outside_work_proud_of}
        </p>
      </div>

      {/* Hobbies with context */}
      <div className="space-y-3 pt-4 border-t border-border">
        <label className="text-sm font-medium text-foreground">
          Hobbies & Interests
        </label>
        <p className="text-xs text-muted-foreground">
          Select your hobbies and optionally explain how they help you at work
        </p>
        
        <div className="space-y-2">
          {HOBBY_OPTIONS.map((option) => {
            const isSelected = isHobbySelected(option.key);
            const isExpanded = expandedHobbies.includes(option.key);
            const hobbyEntry = hobbyEntries.find(h => h.hobby_type === option.key);
            
            return (
              <div key={option.key} className="space-y-2">
                <div
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-primary/5 border-primary/30' 
                      : 'bg-background border-border hover:border-primary/30 hover:bg-primary/5'
                  }`}
                >
                  <label className="flex items-center gap-3 flex-1 cursor-pointer">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleHobbyToggle(option.key)}
                    />
                    <span className={`text-sm ${isSelected ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                      {option.label}
                    </span>
                  </label>
                  {isSelected && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(option.key)}
                      className="ml-2"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
                
                {isSelected && isExpanded && hobbyEntry && (
                  <Card className="ml-6 border-primary/20">
                    <CardContent className="pt-4 space-y-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">
                          Tell us more (optional)
                        </label>
                        <Input
                          placeholder="e.g., I swim 4 mornings a week before work..."
                          value={hobbyEntry.hobby_detail || ''}
                          onChange={(e) => updateHobbyEntry(option.key, 'hobby_detail', e.target.value.slice(0, ASCENT_CHAR_LIMITS.hobby_detail) || null)}
                          maxLength={ASCENT_CHAR_LIMITS.hobby_detail}
                          className="mt-1 text-sm"
                        />
                        <p className="text-xs text-muted-foreground text-right mt-1">
                          {(hobbyEntry.hobby_detail || '').length}/{ASCENT_CHAR_LIMITS.hobby_detail}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">
                          How does this help at work? (optional)
                        </label>
                        <Input
                          placeholder="e.g., Discipline, timekeeping, dedication..."
                          value={hobbyEntry.skills_demonstrated || ''}
                          onChange={(e) => updateHobbyEntry(option.key, 'skills_demonstrated', e.target.value.slice(0, ASCENT_CHAR_LIMITS.skills_demonstrated) || null)}
                          maxLength={ASCENT_CHAR_LIMITS.skills_demonstrated}
                          className="mt-1 text-sm"
                        />
                        <p className="text-xs text-muted-foreground text-right mt-1">
                          {(hobbyEntry.skills_demonstrated || '').length}/{ASCENT_CHAR_LIMITS.skills_demonstrated}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
