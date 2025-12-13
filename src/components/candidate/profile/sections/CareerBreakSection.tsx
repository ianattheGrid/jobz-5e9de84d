import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { GlowCard, GlowCardContent, GlowCardHeader, GlowCardTitle, GlowCardDescription } from "@/components/ui/glow-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Clock, Plus, Trash2 } from "lucide-react";
import { CareerBreak } from "@/integrations/supabase/types/profiles";

const BREAK_TYPE_OPTIONS = [
  { value: 'caring_family', label: 'Caring for family (children, elderly, etc.)' },
  { value: 'personal_health', label: 'Personal health / well-being' },
  { value: 'travel_sabbatical', label: 'Travel / Sabbatical' },
  { value: 'education_training', label: 'Further education / Training' },
  { value: 'volunteering', label: 'Volunteering / Community work' },
  { value: 'entrepreneurship', label: 'Entrepreneurship / Starting a business' },
  { value: 'other', label: 'Other (please specify)' },
];

const RETURN_READINESS_OPTIONS = [
  { value: 'immediate', label: 'Ready to start immediately' },
  { value: 'within_1_3_months', label: 'Looking to start within 1-3 months' },
  { value: 'within_3_6_months', label: 'Looking to start within 3-6 months' },
  { value: 'flexible', label: 'Flexible / Open to discussion' },
];

const RETURN_TYPE_OPTIONS = [
  { value: 'full_time', label: 'Full-time' },
  { value: 'part_time', label: 'Part-time' },
  { value: 'flexible_hours', label: 'Flexible hours' },
  { value: 'project_contract', label: 'Project-based / Contract' },
  { value: 'hybrid_remote', label: 'Hybrid / Remote' },
];

interface CareerBreakSectionProps {
  careerBreaks: CareerBreak[];
  onCareerBreaksChange: (breaks: CareerBreak[]) => void;
}

export function CareerBreakSection({ careerBreaks, onCareerBreaksChange }: CareerBreakSectionProps) {
  const [isEnabled, setIsEnabled] = useState(careerBreaks.length > 0);

  const handleToggle = (enabled: boolean) => {
    setIsEnabled(enabled);
    if (!enabled) {
      onCareerBreaksChange([]);
    }
  };

  const addBreak = () => {
    const newBreak: CareerBreak = {
      id: crypto.randomUUID(),
      break_type: [],
      break_type_other: null,
      break_start_date: '',
      break_end_date: '',
      break_gains_description: '',
      return_readiness: 'immediate',
      return_type_preference: [],
    };
    onCareerBreaksChange([...careerBreaks, newBreak]);
  };

  const updateBreak = (id: string, updates: Partial<CareerBreak>) => {
    onCareerBreaksChange(
      careerBreaks.map(b => b.id === id ? { ...b, ...updates } : b)
    );
  };

  const removeBreak = (id: string) => {
    onCareerBreaksChange(careerBreaks.filter(b => b.id !== id));
  };

  const toggleBreakType = (breakId: string, typeValue: string, checked: boolean) => {
    const breakItem = careerBreaks.find(b => b.id === breakId);
    if (!breakItem) return;

    const newTypes = checked
      ? [...breakItem.break_type, typeValue]
      : breakItem.break_type.filter(t => t !== typeValue);
    
    updateBreak(breakId, { break_type: newTypes });
  };

  const toggleReturnType = (breakId: string, typeValue: string, checked: boolean) => {
    const breakItem = careerBreaks.find(b => b.id === breakId);
    if (!breakItem) return;

    const newTypes = checked
      ? [...breakItem.return_type_preference, typeValue]
      : breakItem.return_type_preference.filter(t => t !== typeValue);
    
    updateBreak(breakId, { return_type_preference: newTypes });
  };

  return (
    <Collapsible open={isEnabled} onOpenChange={handleToggle}>
      <GlowCard>
        <GlowCardHeader>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <GlowCardTitle className="text-lg">My Career Break(s)</GlowCardTitle>
                <GlowCardDescription>
                  Optional - explain employment gaps positively
                </GlowCardDescription>
              </div>
            </div>
            <CollapsibleTrigger asChild>
              <Switch checked={isEnabled} />
            </CollapsibleTrigger>
          </div>
        </GlowCardHeader>
        <CollapsibleContent>
          <GlowCardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              I've had a significant career break and would like to explain it. This helps employers understand your journey.
            </p>

            {careerBreaks.map((breakItem, index) => (
              <Card key={breakItem.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      Career Break #{index + 1}
                    </CardTitle>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBreak(breakItem.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Break Type */}
                  <div className="space-y-2">
                    <Label>What was the primary reason for this career break?</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {BREAK_TYPE_OPTIONS.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${breakItem.id}-${option.value}`}
                            checked={breakItem.break_type.includes(option.value)}
                            onCheckedChange={(checked) => 
                              toggleBreakType(breakItem.id, option.value, checked as boolean)
                            }
                          />
                          <Label 
                            htmlFor={`${breakItem.id}-${option.value}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {breakItem.break_type.includes('other') && (
                      <Input
                        placeholder="Please specify (max 80 characters)"
                        maxLength={80}
                        value={breakItem.break_type_other || ''}
                        onChange={(e) => updateBreak(breakItem.id, { break_type_other: e.target.value })}
                        className="mt-2"
                      />
                    )}
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        type="month"
                        value={breakItem.break_start_date}
                        onChange={(e) => updateBreak(breakItem.id, { break_start_date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input
                        type="month"
                        value={breakItem.break_end_date}
                        onChange={(e) => updateBreak(breakItem.id, { break_end_date: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* What I Gained */}
                  <div className="space-y-2">
                    <Label>What I Did / What I Gained</Label>
                    <Textarea
                      placeholder="Example: 'Managed household budget, developed strong time management skills balancing family needs, volunteered for local charity event planning.'"
                      maxLength={300}
                      value={breakItem.break_gains_description}
                      onChange={(e) => updateBreak(breakItem.id, { break_gains_description: e.target.value })}
                      className="min-h-[80px]"
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {breakItem.break_gains_description.length}/300 characters
                    </p>
                  </div>

                  {/* Readiness to Return */}
                  <div className="space-y-2">
                    <Label>When are you looking to return to work?</Label>
                    <RadioGroup
                      value={breakItem.return_readiness}
                      onValueChange={(value) => updateBreak(breakItem.id, { 
                        return_readiness: value as CareerBreak['return_readiness'] 
                      })}
                    >
                      {RETURN_READINESS_OPTIONS.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.value} id={`${breakItem.id}-readiness-${option.value}`} />
                          <Label htmlFor={`${breakItem.id}-readiness-${option.value}`} className="font-normal cursor-pointer">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Return Type Preference */}
                  <div className="space-y-2">
                    <Label>What type of work arrangement are you seeking?</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {RETURN_TYPE_OPTIONS.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${breakItem.id}-return-${option.value}`}
                            checked={breakItem.return_type_preference.includes(option.value)}
                            onCheckedChange={(checked) => 
                              toggleReturnType(breakItem.id, option.value, checked as boolean)
                            }
                          />
                          <Label 
                            htmlFor={`${breakItem.id}-return-${option.value}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addBreak}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Career Break
            </Button>
          </GlowCardContent>
        </CollapsibleContent>
      </GlowCard>
    </Collapsible>
  );
}
