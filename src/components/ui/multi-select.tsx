
"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

type Option = {
  value: string;
  label: string;
};

type MultiSelectProps = {
  options: Option[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
};

export function MultiSelect({
  options = [],
  selected = [],
  onChange,
  placeholder = "Select items...",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = React.useCallback((value: string) => {
    onChange(selected.filter((s) => s !== value));
  }, [onChange, selected]);

  // Filter out already selected items and based on input value
  const filteredOptions = React.useMemo(() => {
    const availableOptions = options.filter(option => !selected.includes(option.value));
    if (!inputValue) return availableOptions;
    return availableOptions.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [options, selected, inputValue]);

  return (
    <Command className="overflow-visible bg-transparent">
      <div 
        className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
        onClick={() => setOpen(true)}
      >
        <div className="flex flex-wrap gap-1">
          {selected.map((value) => {
            const option = options.find((o) => o.value === value);
            if (!option) return null;
            return (
              <Badge
                key={value}
                variant="secondary"
                className="rounded-sm px-1 font-normal"
              >
                {option.label}
                <button
                  type="button"
                  className="ml-1 rounded-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnselect(value);
                  }}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          <CommandPrimitive.Input
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={selected.length === 0 ? placeholder : undefined}
            className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      {open && filteredOptions.length > 0 && (
        <div className="absolute z-50 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
          <CommandGroup className="h-full overflow-auto max-h-[200px]">
            {filteredOptions.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => {
                  setInputValue("");
                  onChange([...selected, option.value]);
                  setOpen(false);
                }}
                className="cursor-pointer"
              >
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </div>
      )}
    </Command>
  );
}
