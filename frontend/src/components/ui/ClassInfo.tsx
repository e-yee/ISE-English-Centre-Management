import React from 'react';
import { cn } from '@/lib/utils';
import type { ClassData } from '@/mockData/classListMock';

interface ClassInfoProps {
  classData: ClassData;
  studentCount: string; // Format: "10/50"
  className?: string;
}

const ClassInfo: React.FC<ClassInfoProps> = ({ classData, studentCount, className }) => {
  return (
    <div className={cn("flex items-center justify-between w-full", className)}>
      {/* Left Side - Class Name and Student Count */}
      <div className="flex items-center gap-4">
        {/* Class Name */}
        <div
          className={cn(
            // Class name container with light blue background and rounded corners
            'bg-[#B7D5F4] border-[3px] border-black rounded-[30px]',
            'shadow-[5px_4px_4px_0px_rgba(0,0,0,0.25)]',
            'px-6 py-3 flex items-center justify-center'
          )}
        >
          <h1 className="text-[40px] font-normal text-black leading-[1em] text-center font-roboto">
            {classData.className.replace(/^\d+\./, '')} {/* Remove number prefix for display */}
          </h1>
        </div>

        {/* Student Count - Next to class name */}
        <div
          className={cn(
            // Student count container with white background and inset shadow (matching Figma design)
            'bg-white border-[2px] border-black rounded-[20px]',
            'shadow-[inset_6px_4px_10px_0px_rgba(0,0,0,0.25)]',
            'px-6 py-3 flex items-center justify-center'
          )}
        >
          <span className="text-[40px] font-normal text-black leading-[1em] text-center font-roboto">
            {studentCount}
          </span>
        </div>
      </div>

      {/* Right Side - Date Information */}
      <div className="flex flex-col items-end space-y-1">
        <p className="text-[30px] font-normal text-[rgba(0,0,0,0.5)] leading-[1.33em] font-roboto">
          Start date: {classData.startDate}
        </p>
        <p className="text-[30px] font-normal text-[rgba(0,0,0,0.5)] leading-[1.33em] font-roboto">
          End date: {classData.endDate}
        </p>
      </div>
    </div>
  );
};

export default ClassInfo;
