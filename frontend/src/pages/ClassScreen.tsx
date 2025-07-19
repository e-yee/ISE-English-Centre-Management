import React from 'react';
import { cn } from '@/lib/utils';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import FeatureBar from '@/components/layout/FeatureBar';
import StudentList from '@/components/layout/StudentList';
import ClassInfo from '@/components/ui/ClassInfo';
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar';
import { getStudentsByClassId, getFormattedStudentCount } from '@/mockData/studentListMock';
import { classListMockData } from '@/mockData/classListMock';

interface ClassScreenProps {
  classId?: string; // Optional prop to specify which class to display
  className?: string;
}

// Internal component that uses the sidebar context
const ClassScreenContent: React.FC<ClassScreenProps> = ({ classId = 'CL001', className }) => {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";

  // Get class data
  const classData = classListMockData.find(cls => cls.id === classId);
  if (!classData) {
    return <div>Class not found</div>;
  }

  // Get students for this class
  const students = getStudentsByClassId(classId);
  const studentCount = getFormattedStudentCount(classId);

  return (
    <div className={cn("h-screen bg-gray-50 flex flex-col overflow-hidden", className)}>
      {/* Header - Always at top */}
      <Header isRegistered={true} />

      {/* Sidebar - Fixed position, only shown for registered users */}
      <Sidebar />

      {/* Main Content Area - Flex container to fill remaining height */}
      <div className="flex-1 relative overflow-hidden">
        {/* Content container with sidebar spacing */}
        <div className={cn(
          "h-full flex flex-col transition-all duration-300 ease-in-out",
          isExpanded ? "ml-[295px]" : "ml-20"
        )}>
          {/* Feature Bar Container - Fixed height */}
          <div className="flex-shrink-0 pt-4 pb-2">
            <div className="flex-1 flex overflow-hidden">
              {/* Left padding spacer - reduced when sidebar is compressed */}
              <div className={cn(
                "flex-shrink-0 transition-all duration-300 ease-in-out",
                isExpanded ? "w-8" : "w-2"
              )}></div>
              {/* Feature Bar - extends to right edge, expands from left */}
              <div className="flex-1 overflow-hidden">
                <FeatureBar className="w-full h-[120px]" />
              </div>
            </div>
          </div>

          {/* Class Information Container - Fixed height */}
          <div className="flex-shrink-0">
            <div className="flex-1 flex overflow-hidden">
              {/* Left padding spacer - reduced when sidebar is compressed */}
              <div className={cn(
                "flex-shrink-0 transition-all duration-300 ease-in-out",
                isExpanded ? "w-8" : "w-2"
              )}></div>
              {/* Class Info - extends to right edge, expands from left */}
              <div className="flex-1 overflow-hidden">
                <ClassInfo
                  classData={classData}
                  studentCount={studentCount}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Student List Container - Flexible height to fill remaining space */}
          <div className="flex-1 flex overflow-hidden pb-2">
            {/* Left padding spacer - reduced when sidebar is compressed */}
            <div className={cn(
              "flex-shrink-0 transition-all duration-300 ease-in-out",
              isExpanded ? "w-8" : "w-2"
            )}></div>

            {/* Student List - extends to right edge, expands from left */}
            <div className="flex-1 overflow-hidden">
              <StudentList
                students={students}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main wrapper component that provides sidebar context
const ClassScreen: React.FC<ClassScreenProps> = ({ classId, className }) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <ClassScreenContent classId={classId} className={className} />
    </SidebarProvider>
  );
};

export default ClassScreen;
