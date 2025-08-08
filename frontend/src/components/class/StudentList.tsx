import React from "react";
import { cn } from "@/lib/utils";
import StudentTab from "@/components/class/StudentTab";
import { useSidebar } from "@/components/ui/sidebar";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import type { StudentData } from "@/mockData/studentListMock";
import { Badge } from "@/components/ui/badge";

interface StudentListProps {
  students?: StudentData[];
  className?: string;
  maxStudents?: number; // Optional limit for displayed students
  enableRevealOnScroll?: boolean; // Option to disable animations if needed
  customScrollbar?: boolean; // Option to use custom scrollbar styling
}

const StudentList: React.FC<StudentListProps> = ({
  students = [],
  className,
  maxStudents,
  enableRevealOnScroll = true,
  customScrollbar = true
}) => {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";

  // Apply student limit if specified
  const displayedStudents = maxStudents ? students.slice(0, maxStudents) : students;

  const showEmpty = displayedStudents.length === 0;

  return (
    <div className={cn(
      // Main container - transparent background, full height with animations
      'bg-transparent h-full w-full transition-all duration-300 ease-in-out',
      className
    )}>
      {/* Students Grid with Scroll View and animations */}
      <div className={cn(
        "h-full overflow-y-auto space-y-3 transition-all duration-300 ease-in-out",
        // Padding animation - more space when sidebar is collapsed
        isExpanded ? "p-4" : "p-6",
        // Custom scrollbar styling
        customScrollbar && "custom-scrollbar"
      )}>
        {showEmpty && (
          <div className="w-full flex justify-center items-center">
            <Badge variant="outline" className="text-gray-600">No students</Badge>
          </div>
        )}
        {displayedStudents.map((studentData, index) => {
          const studentComponent = (
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
          );

          // Conditionally wrap with RevealOnScroll
          if (enableRevealOnScroll) {
            return (
              <RevealOnScroll
                key={studentData.id || `student-${index}`}
                delay={50}
                variant="fade-up"
                className="w-full"
              >
                {studentComponent}
              </RevealOnScroll>
            );
          }

          return (
            <div key={studentData.id || `student-${index}`} className="w-full">
              {studentComponent}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentList;
