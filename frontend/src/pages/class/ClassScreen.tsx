import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { cn, getUserRole } from '@/lib/utils';
import StudentProfilePanel from '@/components/student/StudentProfilePanel';
import FeatureButtonList from '@/components/class/FeatureButtonList';
import ClassInfo from '@/components/class/ClassInfo';
import StudentList from '@/components/class/StudentList';
import { useClassStudents } from '@/hooks/entities/useStudent';
import { useClasses } from '@/hooks/entities/useClasses';
import type { ClassData } from '@/types/class';
import type { StudentData } from '@/mockData/studentListMock';

interface ClassScreenProps {
  className?: string;
}

const ClassScreen: React.FC<ClassScreenProps> = ({ className }) => {
  const { classId } = useParams<{ classId: string }>();
  const [search] = useSearchParams();
  const qpCourseId = search.get('courseId') || '';
  const qpCourseDate = search.get('courseDate') || '';
  const qpTerm = search.get('term') || '';

  // For Teacher: derive composite keys from assigned classes when query params are missing
  const role = getUserRole();
  const { data: teacherClasses = [] } = role === 'Teacher' ? useClasses() : { data: [] as any[] } as any;
  const classes: any[] = role === 'Teacher' ? (teacherClasses as any[]) : [];
  const classData = classes.find((c: any) => c.id === classId);
  const effCourseId = qpCourseId || classData?.course_id || '';
  const effCourseDate = qpCourseDate || classData?.course_date || '';
  const effTerm = qpTerm || (classData?.term != null ? String(classData.term) : '');

  // Fetch students using effective composite key
  const { data: students = [], isLoading, error } = useClassStudents(
    classId || '',
    effCourseId,
    effCourseDate,
    effTerm
  );
  
  if (!classId) {
    return <div>Class ID not provided</div>;
  }

  // Build minimal ClassData from route/query (room/time unknown without separate fetch)
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
          statusColor: 'today',
        } as ClassData;
      })()
    : {
        id: classId,
        className: `Class ${classId}`,
        courseId: effCourseId,
        room: '—',
        time: '—',
        status: 'Today',
        statusColor: 'today',
      };
  
  // Helper function to parse contact_info into email and phone
  const parseContactInfo = (contactInfo: string) => {
    // Try to extract email and phone from contact_info
    const emailMatch = contactInfo.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = contactInfo.match(/(\+?[\d\s\-\(\)]+)/);
    
    const email = emailMatch ? emailMatch[0] : '';
    const phone = phoneMatch ? phoneMatch[0] : '';
    
    // Combine email and phone into a single contact field
    if (email && phone) {
      return `${email} | ${phone}`;
    } else if (email) {
      return email;
    } else if (phone) {
      return phone;
    } else {
      return contactInfo; // Use full contact_info if no email/phone found
    }
  };

  // Transform real student data to StudentData format for StudentList component
  const transformStudentToStudentData = (student: any, index: number): StudentData => {
    const contact = parseContactInfo(student.contact_info || '');
    
    return {
      id: student.id || `student-${index}`,
      studentId: student.id || `student-${index}`,
      name: student.fullname || `Student ${index + 1}`,
      classId: classId || '',
      index: index + 1,
      // Add backend data fields for StudentTab component
      contact: contact,
      dateOfBirth: student.date_of_birth || '',
      contactInfo: student.contact_info || ''
    };
  };

  const transformedStudents = students ? students.map(transformStudentToStudentData) : [];
  const [selectedStudent, setSelectedStudent] = React.useState<StudentData | null>(null);
  
  // Calculate actual student count from real data
  const actualStudentCount = transformedStudents.length;
  const maxCapacity = 50; // Default max capacity
  const formattedStudentCount = `${actualStudentCount}/${maxCapacity}`;
  
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
      {/* Feature Button List - visible for Teacher; hidden internally for LA/Manager */}
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

      {/* Class Information Section - class name on left, student count on right */}
      <div className={cn(
        "pb-0 flex-shrink-0 transition-all duration-300 ease-in-out",
        "px-4",
        "border-b border-black"
      )}>
        <div className="flex items-center justify-between">
          {role !== 'Teacher' && (
            <button
              onClick={() => window.history.back()}
              className="bg-white border border-black/20 rounded-[10px] shadow-[2px_2px_3px_0px_rgba(0,0,0,0.15)] px-4 py-2 transition-all duration-200 ease-in-out hover:shadow-[3px_3px_4px_0px_rgba(0,0,0,0.2)] hover:scale-105 focus:outline-none focus:ring-1 focus:ring-black focus:ring-offset-1"
            >
              <span className="text-[16px] font-semibold text-black leading-[1em] font-comfortaa whitespace-nowrap">Back</span>
            </button>
          )}
          {role === 'Learning Advisor' && (
            <button
              onClick={() => alert('Add Student: coming soon')}
              className="bg-white border border-black/20 rounded-[10px] shadow-[2px_2px_3px_0px_rgba(0,0,0,0.15)] px-4 py-2 transition-all duration-200 ease-in-out hover:shadow-[3px_3px_4px_0px_rgba(0,0,0,0.2)] hover:scale-105 focus:outline-none focus:ring-1 focus:ring-black focus:ring-offset-1"
            >
              <span className="text-[16px] font-semibold text-black leading-[1em] font-comfortaa whitespace-nowrap">Add Student</span>
            </button>
          )}
        </div>
        <ClassInfo
          classData={transformedClassData}
          studentCount={formattedStudentCount}
        />
      </div>

      {/* Student List + Sliding Profile Panel (match StudentsPage behavior) */}
      <div className={cn('flex-1 min-h-0 relative flex transition-all duration-500 ease-in-out', (role === 'Learning Advisor' || role === 'Manager') && selectedStudent ? 'detail-view-active' : '')}>
        <div className={cn(
          'bg-white transition-all duration-500 ease-in-out min-h-0 overflow-hidden',
          (role === 'Learning Advisor' || role === 'Manager') && selectedStudent ? 'w-[40%] border-r border-gray-200' : 'w-full'
        )}>
          <div className="h-full overflow-auto">
            <StudentList
              students={transformedStudents}
              canSelect={role === 'Learning Advisor' || role === 'Manager'}
              onSelect={(s) => setSelectedStudent(s)}
            />
          </div>
        </div>

        {(role === 'Learning Advisor' || role === 'Manager') && (
          <div className={cn(
            'w-[60%] transition-all duration-500 ease-in-out absolute right-0 top-0 bottom-0 bg-white',
            selectedStudent ? 'translate-x-0' : 'translate-x-full pointer-events-none'
          )}>
            {selectedStudent && (
              <StudentProfilePanel
                student={{
                  id: selectedStudent.studentId,
                  fullname: selectedStudent.name,
                  contact_info: selectedStudent.contactInfo || selectedStudent.contact || '',
                  date_of_birth: selectedStudent.dateOfBirth || ''
                }}
                onMinimize={() => setSelectedStudent(null)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassScreen; 