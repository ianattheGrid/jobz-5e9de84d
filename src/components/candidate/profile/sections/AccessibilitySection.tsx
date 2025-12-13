import { useState, useEffect } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { GlowCard, GlowCardContent, GlowCardHeader, GlowCardTitle, GlowCardDescription } from "@/components/ui/glow-card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Accessibility, Info } from "lucide-react";
import { AccessibilityInfo } from "@/integrations/supabase/types/profiles";

const WORKPLACE_ADJUSTMENT_OPTIONS = [
  { value: 'extra_time', label: 'Extra time for training or written tasks' },
  { value: 'clear_instructions', label: 'Clear written instructions as well as verbal' },
  { value: 'quiet_workspace', label: 'Quiet workspace or fewer interruptions' },
  { value: 'flexible_times', label: 'Flexibility around start/finish times' },
  { value: 'remote_hybrid', label: 'Option for some remote or hybrid working' },
  { value: 'accessible_workspace', label: 'Accessible workspace (step-free, lifts, accessible toilets)' },
  { value: 'assistive_tech', label: 'Assistive tech (screen reader, larger text, specific software)' },
  { value: 'regular_checkins', label: 'Regular check-ins with a manager' },
  { value: 'breaks', label: 'Breaks at certain intervals' },
  { value: 'other', label: 'Other (please specify)' },
];

const WORK_ENVIRONMENT_OPTIONS = [
  { value: 'predictable_routines', label: 'Clear, predictable routines' },
  { value: 'variety', label: 'Variety and changing tasks' },
  { value: 'independent_work', label: 'Opportunities for focused, independent work' },
  { value: 'collaborative_team', label: 'A highly collaborative team setting' },
  { value: 'regular_feedback', label: 'Regular feedback and guidance' },
  { value: 'autonomy', label: 'Autonomy to manage my own tasks' },
  { value: 'calm_space', label: 'A calm and low-sensory space' },
  { value: 'dynamic_atmosphere', label: 'A dynamic and energetic atmosphere' },
  { value: 'other', label: 'Other (please specify)' },
];

const VISIBILITY_OPTIONS = [
  { value: 'always', label: 'Always visible on my profile' },
  { value: 'in_conversation_only', label: "Only visible to employers I'm in conversation with" },
];

interface AccessibilitySectionProps {
  accessibilityInfo: AccessibilityInfo;
  onAccessibilityInfoChange: (info: AccessibilityInfo) => void;
}

export function AccessibilitySection({ accessibilityInfo, onAccessibilityInfoChange }: AccessibilitySectionProps) {
  const [isEnabled, setIsEnabled] = useState(accessibilityInfo.enabled || false);

  useEffect(() => {
    if (accessibilityInfo.enabled !== undefined) {
      setIsEnabled(accessibilityInfo.enabled);
    }
  }, [accessibilityInfo.enabled]);

  const handleToggle = (enabled: boolean) => {
    setIsEnabled(enabled);
    onAccessibilityInfoChange({ ...accessibilityInfo, enabled });
  };

  const updateInfo = (updates: Partial<AccessibilityInfo>) => {
    onAccessibilityInfoChange({ ...accessibilityInfo, ...updates });
  };

  const toggleAdjustment = (value: string, checked: boolean) => {
    const current = accessibilityInfo.workplace_adjustments || [];
    const newAdjustments = checked
      ? [...current, value]
      : current.filter(a => a !== value);
    updateInfo({ workplace_adjustments: newAdjustments });
  };

  const toggleEnvironmentTrait = (value: string, checked: boolean) => {
    const current = accessibilityInfo.preferred_work_environment_traits || [];
    const newTraits = checked
      ? [...current, value]
      : current.filter(t => t !== value);
    updateInfo({ preferred_work_environment_traits: newTraits });
  };

  return (
    <Collapsible open={isEnabled} onOpenChange={handleToggle}>
      <GlowCard>
        <GlowCardHeader>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <Accessibility className="h-5 w-5 text-muted-foreground" />
              <div>
                <GlowCardTitle className="text-lg">Accessibility & How I Work Best</GlowCardTitle>
                <GlowCardDescription>
                  Optional - share preferences that help employers support you
                </GlowCardDescription>
              </div>
            </div>
            <CollapsibleTrigger asChild>
              <Switch checked={isEnabled} />
            </CollapsibleTrigger>
          </div>
        </GlowCardHeader>
        <CollapsibleContent>
          <GlowCardContent className="space-y-6">
            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border">
              <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                I'd like to share information that can help employers support me to do my best work. 
                This information is shared positively and focuses on adjustments, not medical details.
              </p>
            </div>

            {/* Workplace Adjustments */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                These adjustments would help me do my best work:
              </Label>
              <div className="grid grid-cols-1 gap-2">
                {WORKPLACE_ADJUSTMENT_OPTIONS.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`adjustment-${option.value}`}
                      checked={(accessibilityInfo.workplace_adjustments || []).includes(option.value)}
                      onCheckedChange={(checked) => toggleAdjustment(option.value, checked as boolean)}
                    />
                    <Label 
                      htmlFor={`adjustment-${option.value}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
              {(accessibilityInfo.workplace_adjustments || []).includes('other') && (
                <Input
                  placeholder="Please specify (max 120 characters)"
                  maxLength={120}
                  value={accessibilityInfo.workplace_adjustments_other || ''}
                  onChange={(e) => updateInfo({ workplace_adjustments_other: e.target.value })}
                  className="mt-2"
                />
              )}
            </div>

            {/* Preferred Work Environment */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                I work best in an environment that offers:
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {WORK_ENVIRONMENT_OPTIONS.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`environment-${option.value}`}
                      checked={(accessibilityInfo.preferred_work_environment_traits || []).includes(option.value)}
                      onCheckedChange={(checked) => toggleEnvironmentTrait(option.value, checked as boolean)}
                    />
                    <Label 
                      htmlFor={`environment-${option.value}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
              {(accessibilityInfo.preferred_work_environment_traits || []).includes('other') && (
                <Input
                  placeholder="Please specify (max 120 characters)"
                  maxLength={120}
                  value={accessibilityInfo.preferred_work_environment_traits_other || ''}
                  onChange={(e) => updateInfo({ preferred_work_environment_traits_other: e.target.value })}
                  className="mt-2"
                />
              )}
            </div>

            {/* Additional Information */}
            <div className="space-y-2">
              <Label className="text-base font-medium">
                Additional Information (Optional)
              </Label>
              <p className="text-sm text-muted-foreground">
                Is there anything else it would help an employer to know about how you work best?
              </p>
              <Textarea
                placeholder="e.g., 'I'm autistic and thrive with clear written instructions.'"
                maxLength={250}
                value={accessibilityInfo.accessibility_additional_info || ''}
                onChange={(e) => updateInfo({ accessibility_additional_info: e.target.value })}
                className="min-h-[80px]"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Do not include medical diagnoses unless you choose to.
                </p>
                <p className="text-xs text-muted-foreground">
                  {(accessibilityInfo.accessibility_additional_info || '').length}/250 characters
                </p>
              </div>
            </div>

            {/* Visibility Controls */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                When should employers see this information?
              </Label>
              <RadioGroup
                value={accessibilityInfo.accessibility_visibility || 'always'}
                onValueChange={(value) => updateInfo({ 
                  accessibility_visibility: value as AccessibilityInfo['accessibility_visibility'] 
                })}
              >
                {VISIBILITY_OPTIONS.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`visibility-${option.value}`} />
                    <Label htmlFor={`visibility-${option.value}`} className="font-normal cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </GlowCardContent>
        </CollapsibleContent>
      </GlowCard>
    </Collapsible>
  );
}
