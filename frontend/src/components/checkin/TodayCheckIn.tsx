import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import classroomSvg from "@/assets/timekeeping/classroom.svg";

interface TodayCheckInProps {
  className?: string;
  date?: string;
}

const TodayCheckIn: React.FC<TodayCheckInProps> = ({ 
  className,
  date = "Wednesday, July 23, 2025"
}) => {
  return (
    <Card className={cn(
      "bg-[rgba(134,185,226,0.45)] border border-black/20 rounded-[15px] p-4",
      "flex flex-col items-center gap-2",
      "w-full",
      className
    )}>
      {/* Classroom Image */}
      <div className="w-full h-32 rounded-lg shadow-md mb-2 overflow-hidden">
        <img 
          src={classroomSvg} 
          alt="Classroom" 
          className="w-full h-full object-cover object-center"
        />
      </div>
      
      {/* Text Content */}
      <div className="flex flex-col items-center gap-0.5">
        <h3 className="text-xl font-bold text-black text-center">
          Today's Check-in
        </h3>
        <p className="text-base font-light text-black/63 text-center">
          {date}
        </p>
      </div>
    </Card>
  );
};

export default TodayCheckIn; 