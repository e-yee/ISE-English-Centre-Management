import { useDataFetching } from '../base/useDataFetching';
import { useState } from 'react';
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

export function useDeleteStudent() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteStudent = async (id: string): Promise<boolean> => {
    setIsDeleting(true);
    setError(null);
    try {
      await studentService.deleteStudent(id);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete student';
      setError(message);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteStudent, isDeleting, error };
}