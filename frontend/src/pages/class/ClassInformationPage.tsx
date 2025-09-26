import React from 'react';
import { useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import ClassInfo from '@/components/class/ClassInfo';
import FeatureButtonList from '@/components/class/FeatureButtonList';
import { useClasses, useClassesByCourse } from '@/hooks/entities/useClasses';
import { useClassStudents } from '@/hooks/entities/useStudent';
import type { ClassData } from '@/types/class';

interface ClassInformationPageProps {
  className?: string;
}

const ClassInformationPage: React.FC<ClassInformationPageProps> = ({ className }) => {
  const { classId, courseId: routeCourseId, courseDate: routeCourseDate, term: routeTerm } = useParams<{
    classId: string; courseId?: string; courseDate?: string; term?: string;
  }>();
  // Base classes list (teacher flow)
  const { data: classes = [] } = useClasses();

  // For Manager/LA: fetch classes by course/date to enrich with teacher/room when available
  const { data: courseClasses = [] } = useClassesByCourse(
    routeCourseId || '',
    routeCourseDate || ''
  );
  
  // Find the specific class from the fetched classes
  // Prefer exact composite match (id + course) to avoid cross-course collisions
  const classData =
    (courseClasses as any[])?.find?.(
      (cls: any) => cls.id === classId && (!routeCourseId || cls.course_id === routeCourseId) && (!routeCourseDate || cls.course_date === routeCourseDate)
    ) ||
    classes.find(
      (cls: any) => cls.id === classId && (!routeCourseId || cls.course_id === routeCourseId) && (!routeCourseDate || cls.course_date === routeCourseDate)
    );
  
  // Effective composite key: prefer route params (for Manager/LA), fallback to classData (Teacher)
  const effCourseId = routeCourseId || classData?.course_id || '';
  const effCourseDate = routeCourseDate || classData?.course_date || '';
  const effTerm = routeTerm || (classData?.term != null ? String(classData.term) : '');

  // Get students for this class
  const { data: students = [], isLoading: studentsLoading } = useClassStudents(
    classId || '',
    effCourseId,
    effCourseDate,
    effTerm
  );

  if (!classId) {
    return <div className="flex items-center justify-center h-full">Class ID not provided</div>;
  }

  // Render quickly; let class lists hydrate later
  if (studentsLoading) {
    return <div className="flex items-center justify-center h-full">Loading class information...</div>;
  }

  // Build ClassData: prefer real classData, fallback to minimal from params
  const transformedClassData: ClassData = classData
    ? (() => {
        const classDate = new Date(classData.class_date);
        return {
          id: classData.id,
          className: `Class ${classData.id}`,
          courseId: classData.course_id,
          room: classData.room?.name || classData.room_id || '—',
          time: classDate.toTimeString().split(' ')[0],
          status: 'Today',
          statusColor: 'today'
        };
      })()
    : {
        id: classId!,
        className: `Class ${classId}`,
        courseId: effCourseId,
        room: '—',
        time: '—',
        status: 'Today',
        statusColor: 'today'
      };
  
  // Calculate actual student count from real data
  const actualStudentCount = students ? students.length : 0;
  const maxCapacity = 50; // Default max capacity
  const formattedStudentCount = `${actualStudentCount}/${maxCapacity}`;

  return (
    <div className={cn("h-full overflow-hidden flex flex-col", className)}>
      {/* Feature Button List - positioned between header and class info */}
      <div className={cn(
        "pt-3 pb-3 flex-shrink-0 transition-all duration-300 ease-in-out",
        "px-4"
      )}>
        <FeatureButtonList
          classId={classId}
          courseId={effCourseId}
          courseDate={effCourseDate}
          term={effTerm as any}
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
              className="text-4xl font-normal leading-[1.4em] font-comfortaa 
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
          courseName={classData?.course?.name || effCourseId}
          courseId={effCourseId}
          courseDate={effCourseDate}
          term={typeof (classData?.term) === 'number' ? classData?.term : (effTerm ? Number(effTerm) : undefined)}
          teacherName={classData?.teacher?.full_name || classData?.teacher_id || '—'}
          classDate={classData?.class_date || ''}
        />
      </div>
    </div>
  );
};

export default ClassInformationPage; 