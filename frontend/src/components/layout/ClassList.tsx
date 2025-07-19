import React from 'react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';
import Class from '@/components/class/Class';
import type { ClassData } from '@/mockData/classListMock';
import { classListMockData } from '@/mockData/classListMock';

interface ClassListProps {
  classes?: ClassData[];
  className?: string;
}

const ClassList: React.FC<ClassListProps> = ({
  classes = classListMockData,
  className
}) => {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";

  return (
    <div
      className={cn(
        // Main container with light grey background, square corners, and drop shadow
        'bg-white shadow-[inset_5px_4px_4px_0px_rgba(0,0,0,0.25)]', // Inset shadow as per Figma
        'w-full max-w-6xl mx-auto transition-all duration-300 ease-in-out',
        // Height constraint and scrollbar - use full height of container
        'h-full overflow-y-auto custom-scrollbar',
        // Adjust padding based on sidebar state
        isExpanded ? 'p-6' : 'p-4',
        className
      )}
    >
      {/* Classes Grid */}
      <div className="space-y-6">
        {classes.map((classData) => (
          <Class
            key={classData.id}
            classData={classData}
            className="w-full"
          />
        ))}
      </div>
    </div>
  );
};

export default ClassList;
