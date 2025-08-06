import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { User, MapPin } from "lucide-react";

interface ClassCardProps {
  classTitle: string;
  studentCount: number;
  room: string;
  timeInfo: string;
  className?: string;
}

const ClassCard: React.FC<ClassCardProps> = ({ 
  classTitle,
  studentCount,
  room,
  timeInfo,
  className
}) => {
  // Format student count with proper counting
  const formatStudentCount = (count: number) => {
    if (count === 0) return "0";
    if (count === 1) return "1";
    return count.toString();
  };

  return (
    <Card className={cn(
      "bg-white border border-[rgba(11,65,244,0.71)] rounded-[15px] p-3",
      "flex flex-col gap-2",
      "transition-all duration-200 hover:shadow-md",
      className
    )}>
      {/* Top Row: Class Name and Participant Count */}
      <div className="flex justify-between items-start">
        {/* Left: Class Name */}
        <div className="text-xl font-bold text-[#0A6CFF]">
          {classTitle}
        </div>
        
        {/* Right: Student Count Badge */}
        <div className="flex items-center justify-center gap-3 w-[82px] h-[38px] rounded-[10px] bg-white border-[2px] border-solid border-[#4A42AE]">
          <User className="w-6 h-6 text-black/60" />
          <span className="text-[30px] font-normal text-black/60 leading-[140%] font-['Comfortaa']">
            {formatStudentCount(studentCount)}
          </span>
        </div>
      </div>
      
      {/* Room Info */}
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-[rgba(38,125,246,0.74)]" />
        <span className="text-sm font-normal text-[rgba(38,125,246,0.74)]">
          Room: {room}
        </span>
      </div>
      
      {/* Bottom: Time Info aligned to the right */}
      <div className="text-sm font-bold text-[#082541] text-right">
        {timeInfo}
      </div>
    </Card>
  );
};

export default ClassCard; 