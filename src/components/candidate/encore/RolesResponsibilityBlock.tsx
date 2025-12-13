import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Target, X, Plus } from "lucide-react";
import { RESPONSIBILITY_LEVEL_OPTIONS, MAX_ROLE_TYPES } from "./constants";
import { cn } from "@/lib/utils";

interface RolesResponsibilityBlockProps {
  roleTypes: string[];
  responsibilityLevel: string | null;
  onRoleTypesChange: (types: string[]) => void;
  onResponsibilityLevelChange: (level: string | null) => void;
}

export function RolesResponsibilityBlock({
  roleTypes,
  responsibilityLevel,
  onRoleTypesChange,
  onResponsibilityLevelChange,
}: RolesResponsibilityBlockProps) {
  const [inputValue, setInputValue] = useState('');

  const addRoleType = () => {
    if (inputValue.trim() && roleTypes.length < MAX_ROLE_TYPES && !roleTypes.includes(inputValue.trim())) {
      onRoleTypesChange([...roleTypes, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeRoleType = (type: string) => {
    onRoleTypesChange(roleTypes.filter(t => t !== type));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addRoleType();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Target className="h-5 w-5 text-amber-600" />
        <h4 className="text-lg font-semibold text-foreground">Types of Roles I'm Open To Now</h4>
      </div>

      <div className="space-y-4">
        <div className="space-y-3">
          <Label className="text-base font-medium">
            What sort of job titles or types of roles are you open to in this next chapter?
          </Label>
          <p className="text-sm text-muted-foreground">
            Add up to {MAX_ROLE_TYPES} role types (e.g. "Store Manager", "Trainer", "Consultant")
          </p>
          
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a role and press Enter..."
              disabled={roleTypes.length >= MAX_ROLE_TYPES}
            />
            <Button
              type="button"
              variant="outline"
              onClick={addRoleType}
              disabled={!inputValue.trim() || roleTypes.length >= MAX_ROLE_TYPES}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {roleTypes.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {roleTypes.map((type) => (
                <span
                  key={type}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-sm"
                >
                  {type}
                  <button
                    type="button"
                    onClick={() => removeRoleType(type)}
                    className="hover:bg-amber-500/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Label className="text-base font-medium">
            How does the level of responsibility you want now compare to your last role?
          </Label>
          <RadioGroup
            value={responsibilityLevel || ''}
            onValueChange={(v) => onResponsibilityLevelChange(v || null)}
          >
            {RESPONSIBILITY_LEVEL_OPTIONS.map((option) => (
              <label
                key={option.key}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                  responsibilityLevel === option.key
                    ? "border-amber-500/50 bg-amber-500/5"
                    : "border-border hover:bg-muted/50"
                )}
              >
                <RadioGroupItem value={option.key} className="mt-0.5" />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}
