import React from 'react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';
import StudentAttendanceCard from './StudentAttendanceCard';
import type { StudentData } from '@/mockData/studentListMock';

interface StudentAttendanceGridProps {
  students: StudentData[];
  className?: string;
  onCardClick?: (studentId: string) => void;
}

const StudentAttendanceGrid: React.FC<StudentAttendanceGridProps> = ({ 
  students, 
  className, 
  onCardClick 
}) => {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";

  return (
    <div className={cn(
      "bg-transparent h-full w-full transition-all duration-300 ease-in-out",
      className
    )}>
      {/* Students Grid with Scroll View and animations */}
      <div className={cn(
        "h-full overflow-y-auto space-y-4 custom-scrollbar transition-all duration-300 ease-in-out",
        // Padding animation - more space when sidebar is collapsed
        isExpanded ? "p-4" : "p-6"
      )}>
        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {students.map((student) => (
            <StudentAttendanceCard
              key={student.id}
              student={student}
              status="unmarked"
              onClick={() => onCardClick?.(student.id)}
              className="w-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentAttendanceGrid; 