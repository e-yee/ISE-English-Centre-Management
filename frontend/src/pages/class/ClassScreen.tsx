import React from 'react';
import { useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
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
  const { data: classes = [], isLoading: classesLoading } = useClasses();
  
  // Find the specific class from the fetched classes
  const classData = classes.find(cls => cls.id === classId);
  
  // Get students for this class using real API with all required parameters
  // Only call the hook when we have valid classData
  const { data: students = [], isLoading, error } = useClassStudents(
    classData?.id || '',
    classData?.course_id || '',
    classData?.course_date || '',
    classData?.term?.toString() || ''
  );
  
  if (!classId) {
    return <div>Class ID not provided</div>;
  }
  
  if (classesLoading) {
    return <div className="flex items-center justify-center h-full">Loading class data...</div>;
  }
  
  if (!classData) {
    return <div>Class not found</div>;
  }

  // Transform real class data to ClassData format for ClassInfo component
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
      {/* Feature Button List - positioned between header and class info */}
      <div className={cn(
        "pt-4 pb-3 flex-shrink-0 transition-all duration-300 ease-in-out",
        "px-4"
      )}>
        <FeatureButtonList
          classId={classId}
          students={transformedStudents}
          courseId={classData.course_id}
          courseDate={classData.course_date}
          term={classData.term}
        />
      </div>

      {/* Class Information Section - class name on left, student count on right */}
      <div className={cn(
        "pb-3 flex-shrink-0 transition-all duration-300 ease-in-out",
        "px-4"
      )}>
        <ClassInfo
          classData={transformedClassData}
          studentCount={formattedStudentCount}
        />
      </div>

      {/* Student List Container - Full width and height */}
      <div className="flex-1 overflow-hidden">
        <StudentList students={transformedStudents} />
      </div>
    </div>
  );
};

export default ClassScreen; 