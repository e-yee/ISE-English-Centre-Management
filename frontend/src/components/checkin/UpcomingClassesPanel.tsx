import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import ClassCard from "./ClassCard";

interface ClassData {
  id: string;
  classTitle: string;
  studentCount: number;
  room: string;
  timeInfo: string;
}

interface UpcomingClassesPanelProps {
  classes: ClassData[];
  className?: string;
}

const UpcomingClassesPanel: React.FC<UpcomingClassesPanelProps> = ({ 
  classes, 
  className 
}) => {
  return (
    <Card className={cn(
      "bg-white/80 backdrop-blur-sm border border-black/20 rounded-[15px] p-2",
      "flex flex-col h-full min-h-0 max-h-full w-[95%]",
      className
    )}>
      {/* Title */}
      <h2 className="text-xl font-bold text-[#7093DD] mb-3 flex-shrink-0">
        Upcoming Classes
      </h2>
      
      {/* Scrollable Class Cards */}
      <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar min-h-0 max-h-full">
        {classes.map((classData, index) => (
          <div
            key={classData.id}
            className="transition-all duration-300 ease-out"
            style={{
              transitionDelay: `${index * 30}ms`
            }}
          >
            <ClassCard
              classTitle={classData.classTitle}
              studentCount={classData.studentCount}
              room={classData.room}
              timeInfo={classData.timeInfo}
            />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default UpcomingClassesPanel; 