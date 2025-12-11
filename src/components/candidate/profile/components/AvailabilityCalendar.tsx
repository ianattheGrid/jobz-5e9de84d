import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, CalendarDays, Info } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface UnavailablePeriod {
  start: string;
  end: string;
}

interface AvailabilityCalendarProps {
  unavailableDates: UnavailablePeriod[];
  onChange: (dates: UnavailablePeriod[]) => void;
}

export function AvailabilityCalendar({ unavailableDates, onChange }: AvailabilityCalendarProps) {
  const [selectedRange, setSelectedRange] = useState<{ from?: Date; to?: Date }>({});

  const handleAddPeriod = () => {
    if (selectedRange.from) {
      const newPeriod: UnavailablePeriod = {
        start: selectedRange.from.toISOString(),
        end: (selectedRange.to || selectedRange.from).toISOString(),
      };
      onChange([...unavailableDates, newPeriod]);
      setSelectedRange({});
    }
  };

  const handleRemovePeriod = (index: number) => {
    onChange(unavailableDates.filter((_, i) => i !== index));
  };

  // Convert stored dates to Date objects for the calendar
  const disabledDays = unavailableDates.map(period => ({
    from: new Date(period.start),
    to: new Date(period.end),
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CalendarDays className="h-4 w-4" />
        <span>Select dates when you're NOT available for work</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="border rounded-lg p-3">
          <Calendar
            mode="range"
            selected={{ from: selectedRange.from, to: selectedRange.to }}
            onSelect={(range) => setSelectedRange(range || {})}
            disabled={(date) => date < new Date()}
            className={cn("p-3 pointer-events-auto")}
            numberOfMonths={1}
          />
          
          {selectedRange.from && (
            <div className="mt-3 flex justify-end">
              <Button size="sm" onClick={handleAddPeriod}>
                Add Unavailable Period
              </Button>
            </div>
          )}
        </div>

        <div className="flex-1 space-y-3">
          <h4 className="font-medium text-sm">Unavailable Periods</h4>
          
          {unavailableDates.length === 0 ? (
            <div className="flex items-center gap-2 p-4 rounded-lg bg-muted/50 border border-border text-sm text-muted-foreground">
              <Info className="h-4 w-4 shrink-0" />
              <span>No unavailable periods set. You'll appear available for all dates.</span>
            </div>
          ) : (
            <div className="space-y-2">
              {unavailableDates.map((period, index) => {
                const start = new Date(period.start);
                const end = new Date(period.end);
                const isSameDay = start.toDateString() === end.toDateString();
                
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-2 p-2 rounded-lg bg-muted/50 border border-border"
                  >
                    <Badge variant="secondary" className="font-normal">
                      {isSameDay 
                        ? format(start, 'PPP')
                        : `${format(start, 'PP')} - ${format(end, 'PP')}`
                      }
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleRemovePeriod(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
