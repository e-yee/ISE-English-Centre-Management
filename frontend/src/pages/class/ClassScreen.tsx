import React from 'react';
import { cn } from '@/lib/utils';
import FeatureButtonList from '@/components/class/FeatureButtonList';
import ClassInfo from '@/components/class/ClassInfo';
import StudentList from '@/components/class/StudentList';
import { getFormattedStudentCount } from '@/mockData/studentListMock';
import { classListMockData } from '@/mockData/classListMock';
import { useClassStudents } from '@/hooks/entities/useStudent';

interface ClassScreenProps {
  classId?: string; // Optional prop to specify which class to display
  className?: string;
}

const ClassScreen: React.FC<ClassScreenProps> = ({ classId = 'CL001', className }) => {
  // Get class data
  const classData = classListMockData.find(cls => cls.id === classId);
  if (!classData) {
    return <div>Class not found</div>;
  }

  // Get students for this class using real API
  const { data: students = [], isLoading, error } = useClassStudents(classId);
  const studentCount = getFormattedStudentCount(classId);

  // Handle loading state
  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading students...</div>;
  }

  // Handle error state
  if (error) {
    return <div className="flex items-center justify-center h-full text-red-500">Error loading students: {error.message}</div>;
  }

  return (
    <div className={cn("h-full overflow-hidden flex flex-col", className)}>
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
  );
};

export default ClassScreen;


