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
}

const CheckInContainer: React.FC<CheckInContainerProps> = ({
  className,
  date = "Wednesday, July 23, 2025",
  onCheckIn,
  isLoading = false,
  error = null,
  success = null
}) => {
  return (
    <Card className={cn(
      "bg-white/80 backdrop-blur-sm border border-black/20 rounded-[15px] p-6",
      "flex flex-col items-center gap-4",
      "w-full h-[calc(100%-1rem)]",
      className
    )}>
      <TodayCheckIn date={date} />
      
      {/* Error Message */}
      {error && (
        <div className="w-full p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {/* Success Message */}
      {success && (
        <div className="w-full p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm">
          {success}
        </div>
      )}
      
      <CheckInButton 
        onClick={onCheckIn} 
        disabled={isLoading}
      />
    </Card>
  );
};

export default CheckInContainer; 