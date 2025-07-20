import React from 'react';
import { cn } from '@/lib/utils';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import FeatureButtonList from '@/components/class/FeatureButtonList';
import ClassInfo from '@/components/class/ClassInfo';
import StudentList from '@/components/class/StudentList';
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
    <div className={cn("h-screen w-screen bg-gray-50 overflow-hidden", className)}>
      {/* Header - Always at top, full width */}
      <div className="w-full h-20"> {/* Fixed header height */}
        <Header isRegistered={true} />
      </div>

      {/* Main content area with sidebar */}
      <div className="relative h-[calc(100vh-5rem)]">
        {/* Sidebar - positioned to touch bottom of header */}
        <div className="absolute left-0 top-0 h-full">
          <Sidebar />
        </div>

        {/* Content area - full remaining height, following Homescreen layout pattern */}
        <div className={cn(
          "h-full transition-all duration-300 ease-in-out overflow-hidden flex flex-col",
          isExpanded ? "ml-[335px]" : "ml-[120px]" // Space for sidebar + toggle button
        )}>
          {/* Feature Button List - positioned between header and class info */}
          <div className={cn(
            "pt-4 pb-3 flex-shrink-0 transition-all duration-300 ease-in-out",
            "px-4"
          )}>
            <FeatureButtonList />
          </div>

          {/* Class Information Section - class name on left, student count on right */}
          <div className={cn(
            "pb-3 flex-shrink-0 transition-all duration-300 ease-in-out",
            "px-4"
          )}>
            <ClassInfo
              classData={classData}
              studentCount={studentCount}
            />
          </div>

          {/* Student List Container - Full width and height */}
          <div className="flex-1 overflow-hidden">
            <StudentList students={students} />
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


