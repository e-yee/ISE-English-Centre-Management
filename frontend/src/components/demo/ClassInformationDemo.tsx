import React from 'react';
import { cn } from '@/lib/utils';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar';
import ClassInfo from '@/components/class/ClassInfo';
import FeatureButtonList from '@/components/class/FeatureButtonList';
import type { ClassData } from '@/mockData/classListMock';

interface ClassInformationDemoProps {
  className?: string;
}

// Internal component that uses the sidebar context
const ClassInformationDemoContent: React.FC<ClassInformationDemoProps> = ({ className }) => {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";

  // Mock class data for demonstration
  const mockClassData: ClassData = {
    id: 'CL001',
    className: 'Class 1A',
    startDate: '20/06/2025',
    endDate: '20/08/2025',
    room: 'I72',
    time: '17:00:00',
    status: 'Today',
    statusColor: 'today',
    progress: 60
  };

  const mockStudentCount = "20";

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

        {/* Content area - full remaining height, following ClassScreen layout pattern */}
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
      </div>
    </div>
  );
};

// Main component with SidebarProvider
const ClassInformationDemo: React.FC<ClassInformationDemoProps> = ({ className }) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <ClassInformationDemoContent className={className} />
    </SidebarProvider>
  );
};

export default ClassInformationDemo;
