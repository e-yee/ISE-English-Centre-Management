import React from "react";
import { cn } from "@/lib/utils";
import type { TimeEntry } from "@/mockData/timeEntriesMock";

interface TimeEntryCardProps {
  entry: TimeEntry;
  className?: string;
}

const TimeEntryCard: React.FC<TimeEntryCardProps> = ({ entry, className }) => {
  const isLate = entry.status === 'late';
  
  return (
    <div className={cn(
      "bg-[#ECEDF8] border border-[#F4F5FB] rounded-[15px] p-4 flex items-center justify-between shadow-md hover:shadow-lg transition-shadow duration-200",
      className
    )}>
      {/* Left side - Date */}
      <div className="flex flex-col gap-1">
        <div className="text-lg font-normal text-black font-comfortaa">
          {entry.date}
        </div>
      </div>
      
      {/* Center - Clock In Time */}
      <div className="flex flex-col items-center gap-1">
        <div className="text-sm font-semibold text-[rgba(0,0,0,0.5)] font-comfortaa">
          Clock In
        </div>
        <div className="text-xl font-semibold text-black font-comfortaa">
          {entry.clockInTime}
        </div>
      </div>
      
      {/* Right side - Status Badge */}
      <div className={cn(
        "px-6 py-1 rounded-[8px] border border-[rgba(137,116,221,0.5)]",
        isLate 
          ? "bg-[rgba(175,172,172,0.25)]" 
          : "bg-[rgba(145,126,222,0.62)]"
      )}>
        <div className={cn(
          "text-sm font-semibold font-comfortaa text-center",
          isLate 
            ? "text-[rgba(0,0,0,0.74)]" 
            : "text-white"
        )}>
          {isLate ? "Late" : "On time"}
        </div>
      </div>
    </div>
  );
};

export default TimeEntryCard; 