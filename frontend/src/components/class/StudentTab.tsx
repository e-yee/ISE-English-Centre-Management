import React from 'react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/hooks/useSidebar';
import type { StudentData } from '@/mockData/studentListMock';

// Import expand icon
import ExpandIcon from '@/assets/expanded.svg';

interface StudentTabProps {
  studentData: StudentData;
  className?: string;
}

const StudentTab: React.FC<StudentTabProps> = ({ studentData, className }) => {
  const { isExpanded } = useSidebar();
  const { index, name, studentId } = studentData;

  return (
    <div
      className={cn(
        // Main container with blue background and rounded corners (matching Figma)
        'bg-[rgba(112,169,255,0.8)] rounded-[20px] shadow-[5px_4px_4px_0px_rgba(0,0,0,0.25)] relative',
        'w-full min-h-[80px] flex items-center justify-between transition-all duration-300 ease-in-out',
        'border-2 border-[#D9D9D9]', // Light grey border as per Figma
        // Adjust padding based on sidebar state
        isExpanded ? 'px-6 py-3' : 'px-4 py-2',
        className
      )}
    >
      {/*Left Section - Student Name and ID */}
      <div className="flex items-start">
        {/* Index Number */}
        <span className="w-[40px] flex-shrink-0 pr-2 text-right text-[40px] font-normal text-black leading-[1em] font-roboto">
          {index}.
        </span>

        {/* Name and ID Column - Vertically aligned */}
        <div className="flex flex-col justify-center">
          {/* Student Name */}
          <div className="text-[40px] font-normal text-black leading-[1em] font-roboto">
            {name}
          </div>

          {/* Student ID - Aligned with name using same container approach */}
          <div className="text-[30px] font-normal text-[rgba(0,0,0,0.55)] leading-[1.33em] font-roboto">
            ID: {studentId}
          </div>
        </div>
      </div>

  

      {/* Right Section - Expand Icon */}
      <div className="flex items-center justify-center">
        <div className="w-[31px] h-[27px] flex items-center justify-center">
          <img 
            src={ExpandIcon} 
            alt="Expand" 
            className="w-full h-full object-contain"
            style={{
              filter: 'drop-shadow(3px 2px 4px rgba(0,0,0,0.25))'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentTab;
