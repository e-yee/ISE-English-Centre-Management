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

export function useTeacherClasses() {
  return useDataFetching(
    ['classes', 'teacher'],
    () => classService.getTeacherClasses()
  );
} 