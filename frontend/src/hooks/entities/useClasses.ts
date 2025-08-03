import { useDataFetching } from '../base/useDataFetching';
import classService from '@/services/entities/classService';

export function useClasses() {
  return useDataFetching(
    ['classes'],
    () => {
      console.log('fetching classes');
      return classService.getAllClasses(); // Test with getAllClasses directly
    }
  );
}

export function useTeacherClasses() {
  return useDataFetching(
    ['classes', 'teacher'],
    () => classService.getTeacherClasses()
  );
} 