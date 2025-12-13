import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { HOBBY_OPTIONS, CHAR_LIMITS } from "./constants";
import { HobbyEntry } from "./types";
import { useState } from "react";

interface HobbiesBlockProps {
  hobbyEntries: HobbyEntry[];
  otherText: string | null;
  workNote: string | null;
  onEntriesChange: (entries: HobbyEntry[]) => void;
  onOtherChange: (text: string | null) => void;
  onWorkNoteChange: (text: string | null) => void;
}

export function HobbiesBlock({
  hobbyEntries,
  otherText,
  workNote,
  onEntriesChange,
  onOtherChange,
  onWorkNoteChange,
}: HobbiesBlockProps) {
  const [expandedHobbies, setExpandedHobbies] = useState<string[]>([]);

  const isHobbySelected = (key: string) => 
    hobbyEntries.some(entry => entry.hobby_type === key);

  const getHobbyEntry = (key: string) => 
    hobbyEntries.find(entry => entry.hobby_type === key);

  const handleToggle = (key: string) => {
    if (isHobbySelected(key)) {
      // Remove hobby
      onEntriesChange(hobbyEntries.filter(entry => entry.hobby_type !== key));
      setExpandedHobbies(expandedHobbies.filter(h => h !== key));
    } else {
      // Add hobby with new entry
      const newEntry: HobbyEntry = {
        id: crypto.randomUUID(),
        hobby_type: key,
        hobby_detail: null,
        skills_demonstrated: null,
      };
      onEntriesChange([...hobbyEntries, newEntry]);
      // Auto-expand newly added hobby
      setExpandedHobbies([...expandedHobbies, key]);
    }
  };

  const updateHobbyEntry = (key: string, field: 'hobby_detail' | 'skills_demonstrated', value: string) => {
    onEntriesChange(
      hobbyEntries.map(entry => 
        entry.hobby_type === key 
          ? { ...entry, [field]: value || null }
          : entry
      )
    );
  };

  const toggleExpanded = (key: string) => {
    if (expandedHobbies.includes(key)) {
      setExpandedHobbies(expandedHobbies.filter(h => h !== key));
    } else {
      setExpandedHobbies([...expandedHobbies, key]);
    }
  };

  const showOtherInput = isHobbySelected('other');

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-foreground">Hobbies & Interests</h4>
        <p className="text-sm text-muted-foreground">
          What do you do outside of work? These can show employers valuable traits. Click to expand and add details.
        </p>
      </div>
      
      <div className="grid sm:grid-cols-2 gap-3">
        {HOBBY_OPTIONS.map((option) => {
          const isSelected = isHobbySelected(option.key);
          const entry = getHobbyEntry(option.key);
          const isExpanded = expandedHobbies.includes(option.key);
          
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
                    onCheckedChange={() => handleToggle(option.key)}
                  />
                  <span className={`text-sm ${isSelected ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                    {option.label}
                  </span>
                </label>
                {isSelected && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpanded(option.key);
                    }}
                    className="p-1 hover:bg-primary/10 rounded transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                )}
              </div>
              
              {isSelected && isExpanded && (
                <div className="ml-4 p-3 bg-muted/30 rounded-lg space-y-3 border border-border/50">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">
                      Tell us more (optional)
                    </label>
                    <Input
                      placeholder="e.g., I swim 4 mornings a week before work"
                      value={entry?.hobby_detail || ''}
                      onChange={(e) => updateHobbyEntry(option.key, 'hobby_detail', e.target.value.slice(0, CHAR_LIMITS.hobby_detail))}
                      maxLength={CHAR_LIMITS.hobby_detail}
                      className="mt-1 text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-1 text-right">
                      {(entry?.hobby_detail || '').length}/{CHAR_LIMITS.hobby_detail}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">
                      Skills this shows (optional)
                    </label>
                    <Input
                      placeholder="e.g., Discipline, time management, dedication"
                      value={entry?.skills_demonstrated || ''}
                      onChange={(e) => updateHobbyEntry(option.key, 'skills_demonstrated', e.target.value.slice(0, CHAR_LIMITS.hobby_skills))}
                      maxLength={CHAR_LIMITS.hobby_skills}
                      className="mt-1 text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-1 text-right">
                      {(entry?.skills_demonstrated || '').length}/{CHAR_LIMITS.hobby_skills}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        
        {/* Other option */}
        <div className="space-y-2">
          <label
            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
              showOtherInput 
                ? 'bg-primary/5 border-primary/30' 
                : 'bg-background border-border hover:border-primary/30 hover:bg-primary/5'
            }`}
          >
            <Checkbox
              checked={showOtherInput}
              onCheckedChange={() => {
                if (showOtherInput) {
                  onEntriesChange(hobbyEntries.filter(e => e.hobby_type !== 'other'));
                  onOtherChange(null);
                } else {
                  const newEntry: HobbyEntry = {
                    id: crypto.randomUUID(),
                    hobby_type: 'other',
                    hobby_detail: null,
                    skills_demonstrated: null,
                  };
                  onEntriesChange([...hobbyEntries, newEntry]);
                }
              }}
            />
            <span className={`text-sm ${showOtherInput ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Other
            </span>
          </label>
        </div>
      </div>
      
      {showOtherInput && (
        <div>
          <Input
            placeholder="What other hobbies do you have?"
            value={otherText || ''}
            onChange={(e) => onOtherChange(e.target.value.slice(0, CHAR_LIMITS.hobby_other))}
            maxLength={CHAR_LIMITS.hobby_other}
            className="text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {(otherText || '').length}/{CHAR_LIMITS.hobby_other}
          </p>
        </div>
      )}

      {/* Work connection note */}
      <div className="pt-4 border-t border-border">
        <label className="block">
          <span className="text-sm font-medium text-muted-foreground">
            Optional: if you want, explain briefly how your hobbies might help you at work
          </span>
          <Textarea
            placeholder="e.g., I run a 5-a-side team and a small gaming server – good for organising and talking to people..."
            value={workNote || ''}
            onChange={(e) => onWorkNoteChange(e.target.value.slice(0, CHAR_LIMITS.hobby_to_work_note))}
            maxLength={CHAR_LIMITS.hobby_to_work_note}
            className="mt-2 text-sm resize-none"
            rows={2}
          />
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {(workNote || '').length}/{CHAR_LIMITS.hobby_to_work_note}
          </p>
        </label>
      </div>
    </div>
  );
}
