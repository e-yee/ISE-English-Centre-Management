import React from 'react';
import { cn } from '@/lib/utils';
import type { ClassData } from '@/types/class';
import { Card, CardContent } from '@/components/ui/card';
import AvatarIcon from '@/assets/class/user.svg';
import ClockIcon from '@/assets/class/clock.svg';
import MapPinIcon from '@/assets/class/map-pin.svg';

interface ClassInfoProps {
  classData: ClassData;
  studentCount: string; // Format: "10/50"
  className?: string;
  isExpanded?: boolean; // New prop for expanded view
}

const ClassInfo: React.FC<ClassInfoProps> = ({ classData, studentCount, className, isExpanded = false }) => {
  // Helper function to parse student count
  const parseStudentCount = (countString: string) => {
    const [current, max] = countString.split('/').map(Number);
    return {
      current: current || 0,
      max: max || 50,
      percentage: max > 0 ? Math.round((current / max) * 100) : 0
    };
  };

  // Helper function to get capacity status
  const getCapacityStatus = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return 'full';
    if (percentage >= 75) return 'near-full';
    if (percentage >= 50) return 'moderate';
    return 'available';
  };

  const { current, max, percentage } = parseStudentCount(studentCount);
  const capacityStatus = getCapacityStatus(current, max);

  // If expanded view is requested, render the glassmorphism card layout
  if (isExpanded) {
    return (
      <Card className={cn(
        "class-information-card w-full",
        // Glassmorphism styling with dark border - reduced height to about half
        "border-[3px] border-black rounded-[15px] backdrop-blur-[35px]",
        "shadow-lg min-h-[300px] max-h-[400px]",
        className
      )}
      style={{
        background: 'rgba(212, 208, 208, 0.3)',
      }}>
        <CardContent className="p-6 h-full flex flex-col justify-center">

          {/* Layout following Figma design */}
          <div className="space-y-6">
            {/* Top Row - Student Count (Quantity) */}
            <div className="flex justify-start">
              <div
                className="relative rounded-[10px] p-[3px]"
                style={{
                  background: 'linear-gradient(135deg, #4A42AE 0%, #1E1B48 100%)',
                }}
              >
                <div
                  className="flex items-center gap-3 rounded-[7px] px-4 py-0"
                  style={{
                    background: 'white',
                  }}
                >
                  <img src={AvatarIcon} alt="Students" className="w-6 h-6" style={{ stroke: 'rgba(30, 30, 30, 0.6)', strokeWidth: '3px' }} />
                  <span
                    className="font-comfortaa font-normal leading-[1.4em]"
                    style={{
                      fontSize: '40px',
                      color: 'rgba(0, 0, 0, 0.6)'
                    }}
                  >
                    {current}
                  </span>
                </div>
              </div>
            </div>

            {/* Details Section - Following Figma layout with vertical alignment */}
            <div className="flex gap-12">
              {/* Left Column - Room */}
              <div className="space-y-4">
                {/* Room */}
                <div className="flex items-center gap-2">
                  <img src={MapPinIcon} alt="Room" className="w-5 h-5" style={{ stroke: 'rgba(30, 30, 30, 0.6)', strokeWidth: '2px' }} />
                  <span
                    className="font-comfortaa font-normal leading-[1.4em]"
                    style={{
                      fontSize: '20px',
                      color: 'rgba(0, 0, 0, 0.6)'
                    }}
                  >
                    Room: {classData.room}
                  </span>
                </div>
              </div>

              {/* Right Column - Time */}
              <div className="space-y-4">
                {/* Time */}
                <div className="flex items-center gap-2">
                  <img src={ClockIcon} alt="Time" className="w-5 h-5" style={{ stroke: 'rgba(30, 30, 30, 0.6)', strokeWidth: '2px' }} />
                  <span
                    className="font-comfortaa font-normal leading-[1.4em]"
                    style={{
                      fontSize: '20px',
                      color: 'rgba(0, 0, 0, 0.6)'
                    }}
                  >
                    Time: {classData.time}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default view (existing implementation)
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
            className="text-[60px] font-normal leading-[1.4em] text-center font-comfortaa"
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
              borderColor: capacityStatus === 'full' ? '#E2445C' : 
                          capacityStatus === 'near-full' ? '#F8D222' : '#4A42AE'
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
              className="text-[40px] font-normal leading-[1.4em] text-center font-comfortaa"
              style={{
                color: 'rgba(0, 0, 0, 0.6)'
              }}
            >
              {current} {/* Show actual current count */}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassInfo;
