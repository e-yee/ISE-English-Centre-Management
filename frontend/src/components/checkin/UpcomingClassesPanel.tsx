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
  isLoading?: boolean;
  error?: string | null;
}

const UpcomingClassesPanel: React.FC<UpcomingClassesPanelProps> = ({ 
  classes, 
  className,
  isLoading = false,
  error = null
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
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar min-h-0 max-h-full">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-gray-500">Loading classes...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-red-500 text-center">
              <div className="font-semibold">Error loading classes</div>
              <div className="text-sm">{error}</div>
            </div>
          </div>
        ) : classes.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-gray-500 text-center">
              <div className="font-semibold">No upcoming classes</div>
              <div className="text-sm">You have no classes scheduled</div>
            </div>
          </div>
        ) : (
          classes.map((classData, index) => (
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
          ))
        )}
      </div>
    </Card>
  );
};

export default UpcomingClassesPanel; 