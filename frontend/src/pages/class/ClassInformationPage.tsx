import React from 'react';
import { useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import ClassInfo from '@/components/class/ClassInfo';
import FeatureButtonList from '@/components/class/FeatureButtonList';
import { useClasses } from '@/hooks/entities/useClasses';
import { useClassStudents } from '@/hooks/entities/useStudent';
import type { ClassData } from '@/types/class';

interface ClassInformationPageProps {
  className?: string;
}

const ClassInformationPage: React.FC<ClassInformationPageProps> = ({ className }) => {
  const { classId } = useParams<{ classId: string }>();
  const { data: classes = [], isLoading: classesLoading } = useClasses();
  
  // Find the specific class from the fetched classes
  const classData = classes.find(cls => cls.id === classId);
  
  // Get students for this class using real API with all required parameters
  const { data: students = [], isLoading: studentsLoading } = useClassStudents(
    classData?.id || '',
    classData?.course_id || '',
    classData?.course_date || '',
    classData?.term?.toString() || ''
  );

  if (!classId) {
    return <div className="flex items-center justify-center h-full">Class ID not provided</div>;
  }

  if (classesLoading || studentsLoading) {
    return <div className="flex items-center justify-center h-full">Loading class information...</div>;
  }

  if (!classData) {
    return <div className="flex items-center justify-center h-full">Class not found</div>;
  }

  // Transform class data to ClassData format for ClassInfo component
  const transformClassToClassData = (classItem: any): ClassData => {
    const classDate = new Date(classItem.class_date);
    return {
      id: classItem.id,
      className: `Class ${classItem.id}`,
      courseId: classItem.course_id,
      room: classItem.room?.name || classItem.room_id || 'Unknown Room',
      time: classDate.toTimeString().split(' ')[0],
      status: 'Today', // Default status
      statusColor: 'today'
    };
  };

  const transformedClassData = transformClassToClassData(classData);
  
  // Calculate actual student count from real data
  const actualStudentCount = students ? students.length : 0;
  const maxCapacity = 50; // Default max capacity
  const formattedStudentCount = `${actualStudentCount}/${maxCapacity}`;

  return (
    <div className={cn("h-full overflow-hidden flex flex-col", className)}>
      {/* Feature Button List - positioned between header and class info */}
      <div className={cn(
        "pt-4 pb-3 flex-shrink-0 transition-all duration-300 ease-in-out",
        "px-4"
      )}>
        <FeatureButtonList
          classId={classId}
          courseId={classData.course_id}
          courseDate={classData.course_date}
          term={classData.term}
        />
      </div>

      {/* Class Information Section - class name on right, following ClassScreen pattern */}
      <div className={cn(
        "pt-2 flex-shrink-0 transition-all duration-300 ease-in-out",
        "px-8"
      )}>
        <div className="flex items-center w-full">
          {/* Left side - Class Name */}
          <div className="flex items-center flex-1">
            <h1
              className="text-5xl font-normal leading-[1.4em] font-comfortaa 
                         text-violet-600">
              {transformedClassData.className}
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
          classData={transformedClassData}
          studentCount={formattedStudentCount}
          isExpanded={true}
          courseName={classData.course?.name || classData.course_id}
          courseId={classData.course_id}
          courseDate={classData.course_date}
          term={classData.term}
          teacherName={classData.teacher?.full_name || classData.teacher_id}
          classDate={classData.class_date}
        />
      </div>
    </div>
  );
};

export default ClassInformationPage; 