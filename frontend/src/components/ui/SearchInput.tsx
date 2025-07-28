import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
  showIcon?: boolean;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onSearch, showIcon = true, ...props }, ref) => {
    const [value, setValue] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      
      // Call the onChange prop if provided
      if (props.onChange) {
        props.onChange(e);
      }
      
      // Call the onSearch prop if provided
      if (onSearch) {
        onSearch(newValue);
      }
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (onSearch) {
        onSearch(value);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          {showIcon && (
            <button
              type="submit"
              className={cn(
                "absolute left-4 flex items-center justify-center z-10",
                "hover:scale-105 transition-transform duration-200",
                "focus:outline-none focus:scale-105"
              )}
              aria-label="Search"
            >
              <img
                src="/src/assets/header/search.svg"
                alt="Search"
                className="w-6 h-6"
              />
            </button>
          )}

          <input
            ref={ref}
            type="text"
            value={value}
            onChange={handleChange}
            className={cn(
              // Base styling matching Figma design - reduced border width
              "flex rounded-[10px] border border-black/20 bg-white",
              "py-2 text-[20px] font-medium font-comfortaa",
              "text-black placeholder:text-black/50",
              // Focus states
              "focus:outline-none focus:border-black/20 focus:ring-0",
              // Disabled state
              "disabled:cursor-not-allowed disabled:opacity-50",
              // Add padding for icon if shown
              showIcon ? "pl-12 pr-6" : "px-6",
              // Set width and height to match button dimensions
              "w-[500px] h-10",
              className
            )}
            placeholder="Search classes"
            {...props}
          />
        </div>
      </form>
    );
  }
);

SearchInput.displayName = "SearchInput";

export { SearchInput };
