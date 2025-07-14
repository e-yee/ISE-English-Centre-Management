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
          <input
            ref={ref}
            type="text"
            value={value}
            onChange={handleChange}
            className={cn(
              // Base styling matching Figma design
              "flex h-14 w-full rounded-[50px] border-[4px] border-black bg-white",
              "px-6 py-3 text-[30px] font-normal font-['Rhodium_Libre']",
              "text-black placeholder:text-black/50",
              // Focus states
              "focus:outline-none focus:border-black focus:ring-0",
              // Shadow effect from Figma
              "shadow-[4px_6px_4px_0px_rgba(0,0,0,0.25)]",
              // Disabled state
              "disabled:cursor-not-allowed disabled:opacity-50",
              // Add padding for icon if shown
              showIcon && "pr-16",
              className
            )}
            placeholder="Search..."
            {...props}
          />
          
          {showIcon && (
            <button
              type="submit"
              className={cn(
                "absolute right-4 flex items-center justify-center",
                "hover:scale-105 transition-transform duration-200",
                "focus:outline-none focus:scale-105"
              )}
              aria-label="Search"
            >
              <img 
                src="/src/assets/HeaderIcons/search.svg" 
                alt="Search" 
                className="w-8 h-8"
              />
            </button>
          )}
        </div>
      </form>
    );
  }
);

SearchInput.displayName = "SearchInput";

export { SearchInput };
