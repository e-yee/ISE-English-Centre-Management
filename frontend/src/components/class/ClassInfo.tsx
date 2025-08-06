import React from 'react';
import { cn } from '@/lib/utils';
import type { ClassData } from '@/types/class';
import { Card, CardContent } from '@/components/ui/card';
import AvatarIcon from '@/assets/class/user.svg';
import ClockIcon from '@/assets/class/clock.svg';
import MapPinIcon from '@/assets/class/map-pin.svg';
import { BookOpen, GraduationCap, Hash, Calendar, Clock, MapPin, Award } from 'lucide-react';

interface ClassInfoProps {
  classData: ClassData;
  studentCount: string; // Format: "10/50"
  className?: string;
  isExpanded?: boolean; // New prop for expanded view
  // Additional props for comprehensive class information
  courseName?: string;
  courseId?: string;
  courseDate?: string;
  term?: number;
  teacherName?: string;
  classDate?: string;
}

const ClassInfo: React.FC<ClassInfoProps> = ({ 
  classData, 
  studentCount, 
  className, 
  isExpanded = false,
  courseName,
  courseId,
  courseDate,
  term,
  teacherName,
  classDate
}) => {
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

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const { current, max, percentage } = parseStudentCount(studentCount);
  const capacityStatus = getCapacityStatus(current, max);

  // If expanded view is requested, render the comprehensive card layout
  if (isExpanded) {
    return (
      <Card className={cn(
        "class-information-card w-full",
        // Glassmorphism styling with dark border
        "border-[3px] border-black rounded-[15px] backdrop-blur-[35px]",
        "shadow-lg min-h-[400px]",
        className
      )}
      style={{
        background: 'rgba(212, 208, 208, 0.3)',
      }}>
        <CardContent className="p-6 h-full flex flex-col">
          {/* Top Section: Class ID, Course Name and Student Count */}
          <div className="flex justify-between items-start mb-6">
            {/* Left: Class ID and Course Name */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Hash className="w-5 h-5 text-[#0A6CFF]" />
                <span className="text-base font-semibold text-[#0A6CFF]">
                  {classData.id}
                </span>
              </div>
              <div className="text-2xl font-bold text-[#0A6CFF] leading-tight">
                {courseName || classData.className}
              </div>
            </div>
            
            {/* Right: Student Count Badge */}
            <div className="flex items-center justify-center gap-2 w-[90px] h-[45px] rounded-[10px] bg-white border-[2px] border-solid border-[#4A42AE] flex-shrink-0">
              <img src={AvatarIcon} alt="Students" className="w-6 h-6" style={{ stroke: 'rgba(30, 30, 30, 0.6)', strokeWidth: '3px' }} />
              <span className="text-[28px] font-normal text-black/60 leading-[140%] font-['Comfortaa']">
                {current}
              </span>
            </div>
          </div>
          
          {/* Main Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Course Information */}
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-[rgba(38,125,246,0.74)]" />
                <div>
                  <div className="text-sm font-medium text-gray-600">Course</div>
                  <div className="text-base font-semibold text-[rgba(38,125,246,0.74)]">
                    {courseId || classData.courseId}
                  </div>
                </div>
              </div>

              {/* Teacher Information */}
              <div className="flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-[rgba(38,125,246,0.74)]" />
                <div>
                  <div className="text-sm font-medium text-gray-600">Teacher</div>
                  <div className="text-base font-semibold text-[rgba(38,125,246,0.74)]">
                    {teacherName || 'Unknown Teacher'}
                  </div>
                </div>
              </div>

              {/* Room Information */}
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[rgba(38,125,246,0.74)]" />
                <div>
                  <div className="text-sm font-medium text-gray-600">Room</div>
                  <div className="text-base font-semibold text-[rgba(38,125,246,0.74)]">
                    {classData.room}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Course Date */}
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[rgba(38,125,246,0.74)]" />
                <div>
                  <div className="text-sm font-medium text-gray-600">Course Date</div>
                  <div className="text-base font-semibold text-[rgba(38,125,246,0.74)]">
                    {courseDate ? formatDate(courseDate) : 'N/A'}
                  </div>
                </div>
              </div>

              {/* Term */}
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-[rgba(38,125,246,0.74)]" />
                <div>
                  <div className="text-sm font-medium text-gray-600">Term</div>
                  <div className="text-base font-semibold text-[rgba(38,125,246,0.74)]">
                    {term || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Class Date & Time */}
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#082541]" />
                <div>
                  <div className="text-sm font-medium text-gray-600">Class Date & Time</div>
                  <div className="text-base font-semibold text-[#082541]">
                    {classDate ? `${formatDate(classDate)} at ${formatTime(classDate)}` : classData.time}
                  </div>
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
