import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import TodayCheckIn from "./TodayCheckIn";
import CheckInButton from "./CheckInButton";

interface CheckInContainerProps {
  className?: string;
  date?: string;
  onCheckIn?: () => void;
}

const CheckInContainer: React.FC<CheckInContainerProps> = ({
  className,
  date = "Wednesday, July 23, 2025",
  onCheckIn
}) => {
  return (
    <Card className={cn(
      "bg-white/80 backdrop-blur-sm border border-black/20 rounded-[15px] p-6",
      "flex flex-col items-center gap-4",
      "w-full h-[calc(100%-1rem)]",
      className
    )}>
      <TodayCheckIn date={date} />
      <CheckInButton onClick={onCheckIn} />
    </Card>
  );
};

export default CheckInContainer; 