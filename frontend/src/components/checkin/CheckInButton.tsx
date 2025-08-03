import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CheckInButtonProps {
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const CheckInButton: React.FC<CheckInButtonProps> = ({ 
  onClick, 
  className, 
  disabled = false 
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "bg-gradient-to-r from-[#7093DD] to-[#7093DD] text-white font-bold text-xl",
        "px-8 py-2 rounded-[90px] border-0 shadow-lg",
        "transition-all duration-200 hover:scale-105 hover:shadow-xl",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      {disabled ? "Checking In..." : "Check In"}
    </Button>
  );
};

export default CheckInButton; 