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
        "class-card-container bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out",
        "w-full min-h-[160px] rounded-[15px]",
        className
      )}
      onClick={onClick}
    >
      <CardContent className={cn(
        "transition-all duration-300 ease-in-out",
        isExpanded ? "p-6" : "p-5"
      )}>
        {/* Top Row - Class Name (left), Status Button (center), Room & Time (right) */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-3xl font-bold text-black font-comfortaa">
            <span className="mr-1">{number}</span>
            {name}
          </h3>

          <div className="flex items-center justify-center">
            <img
              src={StatusIconComponent}
              alt={classData.status}
              className="w-32 h-10"
            />
          </div>

          <div className="text-right space-y-0.5">
            <div className="flex items-center justify-end gap-1">
              <img src={MapPinIcon} alt="Room" className="w-4 h-4" />
              <span className="text-base font-normal text-black font-comfortaa">Room: {classData.room}</span>
            </div>
            <div className="flex items-center justify-end gap-1">
              <img src={ClockIcon} alt="Time" className="w-4 h-4" />
              <span className="text-base font-normal text-black font-comfortaa">Time: {classData.time}</span>
            </div>
          </div>
        </div>

        {/* Course ID Row */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-normal text-black/60 font-comfortaa">Course ID: {classData.courseId}</span>
        </div>

        {/* Chevron positioned at the bottom right */}
        <div className="flex justify-end">
          <img src={ChevronRightIcon} alt="Navigate" className="w-10 h-10" />
        </div>
      </CardContent>
    </Card>
  );
};

export default Class;
