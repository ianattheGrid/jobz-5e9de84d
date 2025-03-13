
"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";

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
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleUnselect = (value: string) => {
    onChange(selected.filter((s) => s !== value));
  };

  const selectables = options.filter(option => !selected.includes(option.value));

  const filtered = selectables.filter((option) =>
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Handle clicking outside to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <div
        className="relative group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 cursor-pointer"
        onClick={() => {
          setOpen(true);
          inputRef.current?.focus();
        }}
      >
        <div className="flex gap-1 flex-wrap">
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
                  className="ml-1 ring-offset-background rounded-sm outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleUnselect(value);
                  }}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground cursor-pointer"
            placeholder={selected.length === 0 ? placeholder : undefined}
            onFocus={() => setOpen(true)}
          />
        </div>
      </div>
      {open && (
        <div className="absolute w-full z-50 top-full mt-1 rounded-md border bg-white text-gray-900 shadow-md">
          <Command className="w-full bg-transparent">
            <CommandGroup className="overflow-auto max-h-[200px]">
              {filtered.length > 0 ? (
                filtered.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      onChange([...selected, option.value]);
                      setInputValue("");
                    }}
                    className="cursor-pointer px-2 py-1.5 hover:bg-gray-100"
                  >
                    {option.label}
                  </CommandItem>
                ))
              ) : (
                <div className="py-6 text-center text-sm">No results found.</div>
              )}
            </CommandGroup>
          </Command>
        </div>
      )}
    </div>
  );
}
