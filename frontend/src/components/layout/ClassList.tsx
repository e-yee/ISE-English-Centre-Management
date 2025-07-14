import React from 'react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/hooks/useSidebar';
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
  const { isExpanded } = useSidebar();

  return (
    <div
      className={cn(
        // Main container with light grey background, square corners, and drop shadow
        'bg-white shadow-[inset_5px_4px_4px_0px_rgba(0,0,0,0.25)]', // Inset shadow as per Figma
        'w-full max-w-6xl mx-auto transition-all duration-300 ease-in-out',
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

      {/* Scroll Bar Indicator (decorative) */}
      <div className="flex justify-end mt-6">
        <div className="w-2 h-20 bg-[#C2E8FA] border-[3px] border-[#C2E8FA] rounded-[40px] relative">
          <div className="w-full h-8 bg-[rgba(217,217,217,0.5)] rounded-[40px] absolute top-2"></div>
        </div>
      </div>
    </div>
  );
};

export default ClassList;
