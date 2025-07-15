import React from 'react';
import { cn } from '@/lib/utils';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import FeatureBar from '@/components/layout/FeatureBar';
import StudentList from '@/components/layout/StudentList';
import ClassInfo from '@/components/ui/ClassInfo';
import { SidebarProvider, useSidebar } from '@/hooks/useSidebar';
import { getStudentsByClassId, getFormattedStudentCount } from '@/mockData/studentListMock';
import { classListMockData } from '@/mockData/classListMock';

interface ClassScreenProps {
  classId?: string; // Optional prop to specify which class to display
  className?: string;
}

// Internal component that uses the sidebar context
const ClassScreenContent: React.FC<ClassScreenProps> = ({ classId = 'CL001', className }) => {
  const { isExpanded } = useSidebar();

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
            {/* Container to align with StudentList */}
            <div className={cn(
              "flex justify-center transition-all duration-300 ease-in-out",
              isExpanded ? "pl-8" : "pl-4"
            )}>
              {/* Feature Bar - Positioned to align with left side of StudentList */}
              <div className="max-w-6xl w-full flex justify-start">
                <FeatureBar className={cn(
                  "transition-all duration-300 ease-in-out",
                  isExpanded ? "ml-0" : "ml-4"
                )} />
              </div>
            </div>
          </div>

          {/* Class Information Container - Fixed height */}
          <div className="flex-shrink-0 pb-2">
            {/* Container to align with StudentList */}
            <div className={cn(
              "flex justify-center transition-all duration-300 ease-in-out",
              isExpanded ? "pl-8" : "pl-4"
            )}>
              {/* Class Info - Positioned to align with left side of StudentList */}
              <div className="max-w-6xl w-full flex justify-start">
                <ClassInfo
                  classData={classData}
                  studentCount={studentCount}
                  className={cn(
                    "transition-all duration-300 ease-in-out w-full",
                    isExpanded ? "ml-0" : "ml-4"
                  )}
                />
              </div>
            </div>
          </div>

          {/* Student List Container - Flexible height to fill remaining space */}
          <div className="flex-1 flex overflow-hidden pb-2">
            {/* Left padding spacer - matches feature bar alignment */}
            <div className={cn(
              "flex-shrink-0 transition-all duration-300 ease-in-out",
              isExpanded ? "w-8" : "w-4"
            )}></div>

            {/* Student List - extends to right edge, matches FeatureBar width */}
            <div className="flex-1 overflow-hidden">
              <div className="max-w-6xl mx-auto h-full">
                <StudentList
                  students={students}
                  className={cn(
                    "transition-all duration-300 ease-in-out h-full",
                    isExpanded ? "mx-0" : "mx-4"
                  )}
                />
              </div>
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
    <SidebarProvider>
      <ClassScreenContent classId={classId} className={className} />
    </SidebarProvider>
  );
};

export default ClassScreen;
