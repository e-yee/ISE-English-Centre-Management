import React from 'react';
import { cn } from '@/lib/utils';
import type { ClassData } from '@/mockData/classListMock';
import AvatarIcon from '@/assets/class/user.svg';

interface ClassInfoProps {
  classData: ClassData;
  studentCount: string; // Format: "10/50"
  className?: string;
}

const ClassInfo: React.FC<ClassInfoProps> = ({ classData, studentCount, className }) => {
  return (
    <div className={cn("flex items-center w-full", className)}>
      {/* Left Side - Class Name only */}
      <div className="flex items-center flex-1">
        {/* Class Name - Updated to match Figma gradient design with transparent background */}
        <div
          className={cn(
            // Class name container with transparent background to fit with page background
            'bg-transparent rounded-[30px]',
            'px-0 py-3 flex items-center justify-center'
          )}
        >
          <h1
            className="text-[60px] font-normal leading-[1.4em] text-center font-roboto"
            style={{
              background: 'linear-gradient(135deg, #AB2BAF 0%, #471249 100%), linear-gradient(90deg, #E634E1 0%, #E634E1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {classData.className.replace(/^\d+\./, '')} {/* Remove number prefix for display */}
          </h1>
        </div>
      </div>

      {/* Right Side - Student Count - Positioned to align with rightmost edge of student tabs */}
      <div className="flex items-center justify-end" style={{ marginRight: '10px' }}>
        {/* Student Count - Updated with solid border instead of gradient corners */}
        <div className="relative">
          {/* Content container with solid border */}
          <div
            className="bg-white rounded-[10px] flex items-center justify-center gap-3 px-4 py-0 border-[2px] border-solid"
            style={{
              borderColor: '#4A42AE'
            }}
          >
            {/* User Icon */}
            <div className="w-6 h-6 flex-shrink-0">
              <img
                src={AvatarIcon}
                alt="User"
                className="w-full h-full object-contain"
                style={{
                  filter: 'opacity(0.6)'
                }}
              />
            </div>

            {/* Student Count Text */}
            <span
              className="text-[40px] font-normal leading-[1.4em] text-center font-roboto"
              style={{
                color: 'rgba(0, 0, 0, 0.6)'
              }}
            >
              {studentCount.split('/')[0]} {/* Show only current count, not total */}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassInfo;
