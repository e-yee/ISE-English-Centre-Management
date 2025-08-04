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

export function useClassStudents(classId: string) {
  return useDataFetching(
    ['students', 'class', classId],
    () => {
      console.log('fetching students for class:', classId);
      return studentService.getClassStudents(classId);
    }
  );
} 