
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
  options,
  selected = [],
  onChange,
  placeholder = "Select items...",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  // Ensure we always have arrays to work with
  const safeSelected = Array.isArray(selected) ? selected : [];
  const safeOptions = Array.isArray(options) ? options : [];

  const handleUnselect = (value: string) => {
    onChange(safeSelected.filter((s) => s !== value));
  };

  // Filter out already selected items
  const selectableOptions = React.useMemo(() => {
    return safeOptions.filter((option) => !safeSelected.includes(option.value));
  }, [safeOptions, safeSelected]);

  // Filter options based on input value
  const filteredOptions = React.useMemo(() => {
    if (!inputValue) return selectableOptions;
    return selectableOptions.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [selectableOptions, inputValue]);

  return (
    <div className="relative w-full">
      <Command className="overflow-visible bg-transparent">
        <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          <div className="flex flex-wrap gap-1">
            {safeSelected.map((selectedValue) => {
              const option = safeOptions.find((o) => o.value === selectedValue);
              if (!option) return null;
              return (
                <Badge
                  key={selectedValue}
                  variant="secondary"
                  className="rounded-sm px-1 font-normal"
                >
                  {option.label}
                  <button
                    type="button"
                    className="ml-1 rounded-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onClick={() => handleUnselect(selectedValue)}
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
              placeholder={safeSelected.length === 0 ? placeholder : undefined}
              className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
        <div className="relative mt-2">
          {open && filteredOptions.length > 0 && (
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="max-h-[200px] overflow-auto">
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      setInputValue("");
                      onChange([...safeSelected, option.value]);
                    }}
                    className="cursor-pointer"
                  >
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          )}
        </div>
      </Command>
    </div>
  );
}
