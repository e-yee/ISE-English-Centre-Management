import React from 'react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';
import StudentTab from '@/components/class/StudentTab';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import type { StudentData } from '@/mockData/studentListMock';

interface StudentListProps {
  students: StudentData[];
  className?: string;
}

const StudentList: React.FC<StudentListProps> = ({ students, className }) => {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";

  return (
    <div className={cn(
      // Main container - transparent background, full height with animations
      'bg-transparent h-full w-full transition-all duration-300 ease-in-out',
      className
    )}>
      {/* Students Grid with Scroll View and animations */}
      <div className={cn(
        "h-full overflow-y-auto space-y-3 custom-scrollbar transition-all duration-300 ease-in-out",
        // Padding animation - more space when sidebar is collapsed
        isExpanded ? "p-4" : "p-6"
      )}>
        {students.map((studentData, index) => (
          <RevealOnScroll
            key={studentData.id}
            delay={50}
            variant="fade-up"
            className="w-full"
          >
            <div
              className={cn(
                "transition-all duration-300 ease-in-out transform",
                // Staggered animation effect for sidebar state
                isExpanded ? "scale-100" : "scale-[1.01]"
              )}
              style={{
                transitionDelay: `${index * 30}ms`
              }}
            >
              <StudentTab
                studentData={studentData}
                className={cn(
                  "w-full transition-all duration-300 ease-in-out",
                  // Enhanced styling when sidebar is collapsed
                  isExpanded
                    ? "shadow-sm hover:shadow-md"
                    : "shadow-md hover:shadow-lg border border-gray-200"
                )}
              />
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </div>
  );
};

export default StudentList;
