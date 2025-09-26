import { useDataFetching } from '../base/useDataFetching';
import courseService, { type CreateCourseData } from '@/services/entities/courseService';
import type { Course } from '@/types/course';
import { useState } from 'react';

export function useCourses() {
  return useDataFetching(
    ['courses'],
    () => {
      console.log('fetching courses');
      return courseService.getCoursesByRole();
    }
  );
}

export function useCreateCourse() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCourse = async (courseData: CreateCourseData): Promise<Course | null> => {
    setIsCreating(true);
    setError(null);
    
    try {
      console.log('🔍 useCreateCourse: Creating course with data:', courseData);
      const createdCourse = await courseService.createCourse(courseData);
      console.log('🔍 useCreateCourse: Course created successfully:', createdCourse);
      return createdCourse;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create course';
      console.error('❌ useCreateCourse: Error creating course:', err);
      setError(errorMessage);
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createCourse,
    isCreating,
    error
  };
} 