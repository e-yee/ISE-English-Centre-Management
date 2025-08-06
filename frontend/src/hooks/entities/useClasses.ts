import { useDataFetching } from '../base/useDataFetching';
import classService from '@/services/entities/classService';

export function useClasses() {
  return useDataFetching(
    ['classes'],
    () => {
      console.log('fetching classes');
      return classService.getClassesByRole(); // Use role-based method instead of getAllClasses
    }
  );
}

export function useClassesByCourse(courseId: string, courseDate: string) {
  return useDataFetching(
    ['classes', 'course', courseId, courseDate],
    () => {
      console.log('fetching classes for course:', courseId, courseDate);
      return classService.getAllClassesByCourse(courseId, courseDate);
    },
    {
      enabled: !!courseId && !!courseDate
    }
  );
}

export function useTeacherClasses() {
  return useDataFetching(
    ['classes', 'teacher'],
    () => classService.getTeacherClasses()
  );
} 