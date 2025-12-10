import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ENTRY_LEVEL_SALARY_OPTIONS, 
  FIRST_JOB_AVAILABILITY_OPTIONS, 
  FIRST_JOB_WORK_TYPE_OPTIONS,
  LOOKING_FOR_WORK_REASONS 
} from "./types";

interface EssentialsBlockProps {
  salaryMin: number | null;
  salaryMax: number | null;
  availability: string | null;
  workType: string | null;
  reasons: string[];
  onSalaryMinChange: (value: number | null) => void;
  onSalaryMaxChange: (value: number | null) => void;
  onAvailabilityChange: (value: string | null) => void;
  onWorkTypeChange: (value: string | null) => void;
  onReasonsChange: (reasons: string[]) => void;
}

export function EssentialsBlock({
  salaryMin,
  salaryMax,
  availability,
  workType,
  reasons,
  onSalaryMinChange,
  onSalaryMaxChange,
  onAvailabilityChange,
  onWorkTypeChange,
  onReasonsChange,
}: EssentialsBlockProps) {
  
  const handleReasonToggle = (key: string) => {
    if (reasons.includes(key)) {
      onReasonsChange(reasons.filter(r => r !== key));
    } else {
      onReasonsChange([...reasons, key]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-semibold text-foreground mb-1">The Basics</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Let's start with some quick essentials about what you're looking for
        </p>
      </div>

      {/* Salary Expectations */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">What salary range are you looking for?</Label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Minimum</Label>
            <Select 
              value={salaryMin?.toString() || ""} 
              onValueChange={(v) => onSalaryMinChange(v ? parseInt(v) : null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="From..." />
              </SelectTrigger>
              <SelectContent>
                {ENTRY_LEVEL_SALARY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value.toString()}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Maximum</Label>
            <Select 
              value={salaryMax?.toString() || ""} 
              onValueChange={(v) => onSalaryMaxChange(v ? parseInt(v) : null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="To..." />
              </SelectTrigger>
              <SelectContent>
                {ENTRY_LEVEL_SALARY_OPTIONS.filter(opt => !salaryMin || opt.value >= salaryMin).map((opt) => (
                  <SelectItem key={opt.value} value={opt.value.toString()}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">When can you start?</Label>
        <Select 
          value={availability || ""} 
          onValueChange={(v) => onAvailabilityChange(v || null)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select availability..." />
          </SelectTrigger>
          <SelectContent>
            {FIRST_JOB_AVAILABILITY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Work Type */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">What type of work are you looking for?</Label>
        <Select 
          value={workType || ""} 
          onValueChange={(v) => onWorkTypeChange(v || null)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select work type..." />
          </SelectTrigger>
          <SelectContent>
            {FIRST_JOB_WORK_TYPE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Why Looking for Work */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Why are you looking for work? (select all that apply)</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {LOOKING_FOR_WORK_REASONS.map((reason) => (
            <label
              key={reason.key}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                reasons.includes(reason.key)
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <Checkbox
                checked={reasons.includes(reason.key)}
                onCheckedChange={() => handleReasonToggle(reason.key)}
              />
              <span className="text-sm">{reason.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
