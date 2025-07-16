import React from 'react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/hooks/useSidebar';
import StudentTab from '@/components/class/StudentTab';
import type { StudentData } from '@/mockData/studentListMock';

interface StudentListProps {
  students: StudentData[];
  className?: string;
}

const StudentList: React.FC<StudentListProps> = ({ students, className }) => {
  const { isExpanded } = useSidebar();

  return (
    <div
      className={cn(
        // Main container with white background and inset shadow (matching ClassList)
        'bg-white shadow-[inset_5px_4px_4px_0px_rgba(0,0,0,0.25)] relative', // Inset shadow as per Figma
        'w-full transition-all duration-300 ease-in-out',
        // Use full height and enable scrolling
        'h-full overflow-y-auto custom-scrollbar',
        // Adjust padding based on sidebar state (matching homescreen ClassList behavior)
        isExpanded ? 'p-6' : 'p-4',
        className
      )}
    >
      {/* Students Grid */}
      <div className="space-y-4">
        {students.map((studentData) => (
          <StudentTab
            key={studentData.id}
            studentData={studentData}
            className="w-full"
          />
        ))}
      </div>
    </div>
  );
};

export default StudentList;
