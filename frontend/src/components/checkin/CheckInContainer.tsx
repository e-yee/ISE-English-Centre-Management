import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import TodayCheckIn from "./TodayCheckIn";
import CheckInButton from "./CheckInButton";

interface CheckInContainerProps {
  className?: string;
  date?: string;
  onCheckIn?: () => void;
  isLoading?: boolean;
  error?: string | null;
  success?: string | null;
  disabled?: boolean;
}

const CheckInContainer: React.FC<CheckInContainerProps> = ({
  className,
  date = "Wednesday, July 23, 2025",
  onCheckIn,
  isLoading = false,
  error = null,
  success = null,
  disabled = false
}) => {
  return (
    <Card className={cn(
      "bg-white backdrop-blur-sm border border-black/20 rounded-[15px] p-6",
      "flex flex-col items-center gap-2",
      "w-full h-full",
      className
    )}>
      <TodayCheckIn date={date} />
      <CheckInButton 
        onClick={onCheckIn} 
        disabled={disabled}
        loading={isLoading}
      />

      {/* Error Message */}
      {error && (
        <div className="w-full h-fit px-4 py-1 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Success Message Below Button */}
      {success && (
        <div className="w-full px-4 py-1 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm">
          {success}
        </div>
      )}
    </Card>
  );
};

export default CheckInContainer; 