import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarDays, Info, CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const NOTICE_PERIOD_OPTIONS = [
  { value: "Immediate", label: "Immediate" },
  { value: "1 week notice", label: "1 week notice" },
  { value: "2 weeks notice", label: "2 weeks notice" },
  { value: "1 month notice", label: "1 month notice" },
  { value: "2 months notice", label: "2 months notice" },
  { value: "3+ months notice", label: "3+ months notice" },
];

interface AvailabilitySectionProps {
  availability: string | null;
  onAvailabilityChange: (value: string) => void;
  earliestStartDate: string | null;
  onEarliestStartDateChange: (date: string | null) => void;
}

export function AvailabilitySection({ 
  availability, 
  onAvailabilityChange, 
  earliestStartDate,
  onEarliestStartDateChange 
}: AvailabilitySectionProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  const selectedDate = earliestStartDate ? new Date(earliestStartDate) : undefined;

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onEarliestStartDateChange(date.toISOString());
      setCalendarOpen(false);
    }
  };

  const handleClearDate = () => {
    onEarliestStartDateChange(null);
  };

  return (
    <div className="space-y-6">
      {/* Notice Period Dropdown */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">How much notice do you need to give?</Label>
        <Select value={availability || ""} onValueChange={onAvailabilityChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select your notice period..." />
          </SelectTrigger>
          <SelectContent>
            {NOTICE_PERIOD_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          This helps employers understand your availability timeline
        </p>
      </div>

      <div className="border-t border-border pt-6">
        {/* Earliest Start Date Picker */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">When can you first start work? (Optional)</Label>
          <p className="text-xs text-muted-foreground mb-3">
            If you have a specific date in mind, select it below
          </p>
          
          <div className="flex items-center gap-2">
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Select a date..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            
            {selectedDate && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearDate}
                className="h-10 w-10 shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Info Note */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border">
        <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          Leave the start date blank if your notice period is your only constraint. 
          Employers will use your notice period to estimate when you could start.
        </p>
      </div>
    </div>
  );
}
