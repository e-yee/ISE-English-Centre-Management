import React from 'react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/hooks/useSidebar';
import type { ClassData } from '@/mockData/classListMock';

// Status icon imports
import TodayIcon from '@/assets/status/today.svg';
import TomorrowIcon from '@/assets/status/tomorrow.svg';
import ComingSoonIcon from '@/assets/status/coming_soon.svg';
import ExpiredIcon from '@/assets/status/expired.svg';
import FutureIcon from '@/assets/status/future.svg';

interface ClassProps {
  classData: ClassData;
  className?: string;
}

const Class: React.FC<ClassProps> = ({ classData, className }) => {
  const { isExpanded } = useSidebar();

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
    <div
      className={cn(
        // Main container with light blue background and rounded corners
        'bg-[#C2E8FA] rounded-[30px] shadow-[2px_5px_4px_0px_rgba(0,0,0,0.25)] relative',
        'w-full min-h-[90px] flex flex-col transition-all duration-300 ease-in-out',
        // Adjust padding based on sidebar state
        isExpanded ? 'p-4' : 'p-3',
        className
      )}
    >
      {/* Top Section - Class Name (left), Status Button (middle), Room & Time (right) */}
      <div className="flex items-start justify-between mb-3">
        {/* Top Left - Class Name with number prefix and dates below */}
        <div className="flex flex-col">
          <div className="flex items-baseline mb-1">
            <span className="text-3xl font-bold text-black mr-1">{number}</span>
            <h2 className="text-3xl font-bold text-black">
              {name}
            </h2>
          </div>
          {/* Date Information under class name */}
          <div className="space-y-0.5 ml-1">
            <p className="text-sm font-normal text-black">
              Start date: {classData.startDate}
            </p>
            <p className="text-sm font-normal text-black">
              End date: {classData.endDate}
            </p>
          </div>
        </div>

        {/* Top Middle - Status Icon (sized to match class name height) */}
        <div className="flex items-center justify-center px-4 py-1">
          <img
            src={StatusIconComponent}
            alt={classData.status}
            className="w-40 h-12"
          />
        </div>

        {/* Top Right - Room and Time */}
        <div className="flex flex-col items-end space-y-0.5">
          <p className="text-base font-normal text-black">
            Room: {classData.room}
          </p>
          <p className="text-base font-normal text-gray-600 underline">
            Time: {classData.time}
          </p>
        </div>
      </div>

      {/* Bottom Section - Progress Bar at the bottom with padding */}
      <div className="flex items-center mt-auto mb-2">
        {/* Left spacer to align with status icon */}
        <div className="flex-1"></div>

        {/* Progress bar - spans from status icon to right edge, widens when sidebar compressed */}
        <div className={cn(
          "h-6 bg-white rounded-lg border border-gray-200 flex items-center justify-center transition-all duration-300 ease-in-out",
          isExpanded ? "flex-[1.25] ml-4" : "flex-[1.20] ml-2"
        )}></div>
      </div>
    </div>
  );
};

export default Class;
