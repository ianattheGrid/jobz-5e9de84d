
import * as React from "react";
import { X, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleRemoveItem = (valueToRemove: string) => {
    onChange(selected.filter((value) => value !== valueToRemove));
  };

  const availableOptions = options.filter(
    (option) => 
      !selected.includes(option.value) &&
      (typeof option.label === 'string' && 
       option.label.toLowerCase().includes(searchValue.toLowerCase()))
  );

  const handleClickOutside = React.useCallback((event: MouseEvent) => {
    if (
      containerRef.current && 
      !containerRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  }, []);

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  const handleSelectOption = (option: Option) => {
    onChange([...selected, option.value]);
    setSearchValue("");
    inputRef.current?.focus();
  };

  return (
    <div className="relative" ref={containerRef}>
      <div
        className={`min-h-[40px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 cursor-pointer ${className}`}
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
      >
        <div className="flex flex-wrap gap-1">
          {selected.map((value) => {
            const selectedOption = options.find((o) => o.value === value);
            if (!selectedOption) return null;
            
            return (
              <Badge
                key={value}
                variant="secondary"
                className="rounded-sm px-1 font-normal"
              >
                {selectedOption.label}
                <button
                  type="button"
                  className="ml-1 ring-offset-background rounded-sm outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveItem(value);
                  }}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          <input
            ref={inputRef}
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground cursor-pointer min-w-[80px]"
            placeholder={selected.length === 0 ? placeholder : ""}
            onFocus={() => setIsOpen(true)}
          />
        </div>
        <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50" />
      </div>
      
      {isOpen && availableOptions.length > 0 && (
        <div className="absolute w-full z-50 top-[calc(100%+4px)] rounded-md border border-input bg-white shadow-md">
          <div className="max-h-[200px] overflow-auto py-1">
            {availableOptions.map((option) => (
              <div
                key={option.value}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelectOption(option)}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
