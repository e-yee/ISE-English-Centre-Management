import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/hooks/useSidebar';
import type { StudentData } from '@/mockData/studentListMock';
import StudentInfo from './StudentInfo';

// Import expand icon
import ExpandIcon from '@/assets/class/expanded.svg';

interface StudentTabProps {
  studentData: StudentData;
  className?: string;
}

const StudentTab: React.FC<StudentTabProps> = ({ studentData, className }) => {
  const { isExpanded } = useSidebar();
  const { index, name, studentId } = studentData;
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);

  const handleTabClick = () => {
    setIsInfoExpanded(!isInfoExpanded);
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Student Tab */}
      <div
        onClick={handleTabClick}
        className={cn(
          // Main container with blue background and rounded corners (matching Figma)
          'bg-[rgba(112,169,255,0.8)] shadow-[5px_4px_4px_0px_rgba(0,0,0,0.25)] relative',
          'w-full min-h-[80px] flex items-center justify-between transition-all duration-300 ease-in-out',
          'border-2 border-[#D9D9D9] cursor-pointer hover:opacity-90', // Light grey border as per Figma
          // Adjust padding based on sidebar state (matching homescreen behavior)
          isExpanded ? 'px-6 py-3' : 'px-4 py-2',
          // Conditional border radius based on expansion state
          isInfoExpanded ? 'rounded-t-[20px]' : 'rounded-[20px]'
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
        <div className="w-[31px] h-[27px] flex items-center justify-center select-none cursor-pointer">
          <img
            src={ExpandIcon}
            alt="Expand"
            className={cn(
              "w-full h-full object-contain transition-transform duration-300 ",
              isInfoExpanded && "rotate-180"
            )}
            style={{
              filter: 'drop-shadow(3px 2px 4px rgba(0,0,0,0.25))'
            }}
          />
        </div>
      </div>
      </div>

      {/* Student Info - Expandable Section */}
      <StudentInfo
        isExpanded={isInfoExpanded}
        studentData={{
          email: undefined, // Will show placeholder until real data is available
          phone: undefined, // Will show placeholder until real data is available
          dateOfBirth: undefined, // Will show placeholder until real data is available
          presence: undefined, // Will show placeholder until real data is available
          note: undefined // Will show placeholder until real data is available
        }}
      />
    </div>
  );
};

export default StudentTab;
