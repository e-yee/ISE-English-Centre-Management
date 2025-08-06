import { useDataFetching } from '../base/useDataFetching';
import studentService from '@/services/entities/studentService';

export function useStudents() {
  return useDataFetching(
    ['students'],
    () => {
      console.log('fetching students');
      return studentService.getStudentsByRole();
    }
  );
}

export function useStudentsByRole(classId?: string, courseId?: string, courseDate?: string, term?: string) {
  return useDataFetching(
    ['students', 'role', classId, courseId, courseDate, term],
    () => {
      console.log('fetching students by role with params:', { classId, courseId, courseDate, term });
      return studentService.getStudentsByRole(classId, courseId, courseDate, term);
    },
    {
      enabled: !!(classId && courseId && courseDate && term)
    }
  );
}

export function useClassStudents(classId: string, courseId: string, courseDate: string, term: string) {
  return useDataFetching(
    ['students', 'class', classId, courseId, courseDate, term],
    () => {
      console.log('fetching students for class:', classId, courseId, courseDate, term);
      return studentService.getClassStudents(classId, courseId, courseDate, term);
    },
    {
      enabled: !!classId && !!courseId && !!courseDate && !!term
    }
  );
} 