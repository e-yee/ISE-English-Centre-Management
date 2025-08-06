import React from 'react';
import { cn } from '@/lib/utils';
import ClassInfo from '@/components/class/ClassInfo';
import FeatureButtonList from '@/components/class/FeatureButtonList';
import type { ClassData } from '@/types/class';

interface ClassInformationPageProps {
  className?: string;
  classId?: string;
}

const ClassInformationPage: React.FC<ClassInformationPageProps> = ({ className, classId = 'CL001' }) => {
  // Mock class data for demonstration
  const mockClassData: ClassData = {
    id: 'CL001',
    className: 'Class 1A',
    courseId: 'CRS001',
    room: 'I72',
    time: '17:00:00',
    status: 'Today',
    statusColor: 'today'
  };

  const mockStudentCount = "0";

  return (
    <div className={cn("h-full overflow-hidden flex flex-col", className)}>
      {/* Feature Button List - positioned between header and class info */}
      <div className={cn(
        "pt-4 pb-3 flex-shrink-0 transition-all duration-300 ease-in-out",
        "px-4"
      )}>
        <FeatureButtonList />
      </div>

      {/* Class Information Section - class name on right, following ClassScreen pattern */}
      <div className={cn(
        "pb-3 flex-shrink-0 transition-all duration-300 ease-in-out",
        "px-8"
      )}>
        <div className="flex items-center w-full">
          {/* Left side - Class Name */}
          <div className="flex items-center flex-1">
            <h1
              className="text-[60px] font-normal leading-[1.4em] font-comfortaa"
              style={{
                background: 'linear-gradient(135deg, #AB2BAF 0%, #471249 100%), linear-gradient(90deg, #E634E1 0%, #E634E1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {mockClassData.className}
            </h1>
          </div>

          {/* Right side - empty space for balance */}
          <div className="flex-1"></div>
        </div>
      </div>

      {/* Class Information Card Section - Reduced height container */}
      <div className={cn(
        "flex-shrink-0 transition-all duration-300 ease-in-out",
        "px-8 py-4"
      )}>
        <ClassInfo
          classData={mockClassData}
          studentCount={mockStudentCount}
          isExpanded={true}
        />
      </div>
    </div>
  );
};

export default ClassInformationPage; 