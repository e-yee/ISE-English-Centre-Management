import React from 'react';
import { cn } from '@/lib/utils';
import type { ClassData } from '@/types/class';
import { Card, CardContent } from '@/components/ui/card';
import { useSidebar } from '@/components/ui/sidebar';

// Status icon imports
import TodayIcon from '@/assets/status/today.svg';
import TomorrowIcon from '@/assets/status/tomorrow.svg';
import ComingSoonIcon from '@/assets/status/coming_soon.svg';
import ExpiredIcon from '@/assets/status/expired.svg';
import FutureIcon from '@/assets/status/future.svg';

// New class-specific icon imports
import MapPinIcon from '@/assets/class/map-pin.svg';
import ClockIcon from '@/assets/class/clock.svg';
import ChevronRightIcon from '@/assets/class/chevron-right.svg';

interface ClassProps {
  classData: ClassData;
  className?: string;
  onClick?: () => void;
}

const Class: React.FC<ClassProps> = ({ classData, className, onClick }) => {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";

  // Function to get the appropriate status icon
  const getStatusIcon = (statusColor: string) => {
    switch (statusColor) {
      case 'today':
        return TodayIcon;
      case 'tomorrow':
        return TomorrowIcon;
      case 'coming-soon':
        return ComingSoonIcon;
      case 'expired':
        return ExpiredIcon;
      case 'custom':
        return FutureIcon;
      default:
        return TodayIcon;
    }
  };

  // Function to extract class name without the number prefix
  const getClassNameWithoutNumber = (className: string) => {
    // Extract number and class name (e.g., "1.Class 1A" -> { number: "1.", name: "Class 1A" })
    const match = className.match(/^(\d+\.)(.+)$/);
    if (match) {
      return {
        number: match[1],
        name: match[2].trim()
      };
    }
    return { number: '', name: className };
  };

  const { number, name } = getClassNameWithoutNumber(classData.className);
  const StatusIconComponent = getStatusIcon(classData.statusColor);

  return (
    <Card 
      className={cn(
        "border-none class-card-container bg-white shadow-none hover:shadow-md transition-all duration-300 ease-in-out",
        "w-full h-auto rounded-sm hover:scale-102 hover:bg-gradient-to-r hover:from-indigo-200 hover:via-sky-200 hover:to-blue-200",        
        className
      )}
      onClick={onClick}
    >
      <CardContent className={cn(
        "transition-all duration-300 ease-in-out",
        isExpanded ? "pt-2 px-4 pb-2" : "pt-2 px-4 pb-2"
      )}>
        {/* Top Row - Class Name (left), Status Button (center), Room & Time (right) */}
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold text-black font-comfortaa">
            <span className="">{number}</span>
            {name}
          </h3>

          <div className="flex items-center justify-center">
            <img
              src={StatusIconComponent}
              alt={classData.status}
              className="w-28 h-8"
            />
          </div>

          <div className="text-right">
            <div className="flex items-center justify-start gap-1">
              <img src={MapPinIcon} alt="Room" className="w-4 h-4" />
              <span className="text-sm font-bold text-black/50 font-comfortaa">Room: {classData.room}</span>
            </div>
            <div className="flex items-center justify-start gap-1">
              <img src={ClockIcon} alt="Time" className="w-4 h-4" />
              <span className="text-sm font-bold text-black/50 font-comfortaa">Time: {classData.time}</span>
            </div>
          </div>
        </div>

        {/* Course ID Row */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-normal text-black/60 font-comfortaa">Course ID: {classData.courseId}</span>
        </div>

        {/* Chevron positioned at the bottom right */}
        <div className="flex justify-end">
          <img src={ChevronRightIcon} alt="Navigate" className="w-10 h-7" />
        </div>
      </CardContent>
    </Card>
  );
};

export default Class;
