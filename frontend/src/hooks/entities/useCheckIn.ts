import { useState, useEffect, useCallback } from 'react';
import checkinService from '@/services/entities/checkinService';
import type { CheckInResponse, TeacherClass } from '@/services/entities/checkinService';

// Interface for transformed class data
export interface TransformedClass {
  id: string;
  classTitle: string;
  studentCount: number;
  room: string;
  timeInfo: string;
}

// Time difference calculation function
const calculateTimeDifference = (classDate: string): string => {
  const now = new Date();
  const classDateTime = new Date(classDate);
  
  // Check if class has already passed
  if (classDateTime <= now) {
    return 'Class has already started';
  }
  
  const diffInMs = classDateTime.getTime() - now.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);
  const diffInMinutes = diffInMs / (1000 * 60);
  
  if (diffInHours >= 1) {
    const hours = Math.floor(diffInHours);
    return `Class will start in ${hours} hour${hours > 1 ? 's' : ''}...`;
  } else if (diffInMinutes >= 1) {
    const minutes = Math.floor(diffInMinutes);
    return `Class will start in ${minutes} minute${minutes > 1 ? 's' : ''}...`;
  } else {
    return 'Class will start soon...';
  }
};

// Transform backend data to frontend format
const transformClassData = (classes: TeacherClass[]): TransformedClass[] => {
  const now = new Date();
  
  // Ensure classes is an array
  if (!Array.isArray(classes)) {
    console.warn('transformClassData: classes is not an array:', classes);
    return [];
  }
  
  return classes
    .filter(classData => {
      const classDateTime = new Date(classData.class_date);
      return classDateTime > now; // Only upcoming classes
    })
    .map(classData => ({
      id: classData.id,
      classTitle: classData.course_id,
      studentCount: 0,
      room: classData.room_id,
      timeInfo: calculateTimeDifference(classData.class_date)
    }))
    .sort((a, b) => {
      // Sort by class date by extracting the original class_date from the classes array
      const aClass = classes.find(c => c.id === a.id);
      const bClass = classes.find(c => c.id === b.id);
      if (!aClass || !bClass) return 0;
      
      const aDate = new Date(aClass.class_date);
      const bDate = new Date(bClass.class_date);
      return aDate.getTime() - bDate.getTime();
    });
};

export const useCheckIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Teacher classes state
  const [teacherClasses, setTeacherClasses] = useState<TransformedClass[]>([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [classesError, setClassesError] = useState<string | null>(null);

  const performCheckIn = async (employeeId: string): Promise<CheckInResponse | null> => {
    console.log('🔍 useCheckIn - Starting check-in for employee:', employeeId);
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await checkinService.checkIn(employeeId);
      console.log('✅ useCheckIn - Check-in successful:', result);
      setSuccess(result.message);
      return result;
    } catch (err: any) {
      console.error('❌ useCheckIn - Check-in failed:', err);
      console.error('❌ useCheckIn - Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      const errorMessage = err.response?.data?.message || err.message || 'Check-in failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const performCheckOut = async (): Promise<CheckInResponse | null> => {
    console.log('🔍 useCheckIn - Starting check-out');
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await checkinService.checkOut();
      console.log('✅ useCheckIn - Check-out successful:', result);
      setSuccess(result.message);
      return result;
    } catch (err: any) {
      console.error('❌ useCheckIn - Check-out failed:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Check-out failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // New function to fetch teacher classes - memoized with useCallback
  const fetchTeacherClasses = useCallback(async () => {
    console.log('🔍 useCheckIn - Fetching teacher classes');
    setIsLoadingClasses(true);
    setClassesError(null);
    
    try {
      const response = await checkinService.getTeacherClasses();
      console.log('✅ useCheckIn - Teacher classes fetched:', response);
      
      // Handle case where backend returns object instead of array
      let classes: TeacherClass[];
      if (Array.isArray(response)) {
        classes = response;
      } else if (response && typeof response === 'object') {
        // If response is an object, try to extract classes array
        const responseObj = response as any;
        classes = Array.isArray(responseObj.data) ? responseObj.data : 
                 Array.isArray(responseObj.classes) ? responseObj.classes :
                 Array.isArray(responseObj.results) ? responseObj.results : [];
      } else {
        classes = [];
      }
      
      const transformedClasses = transformClassData(classes);
      setTeacherClasses(transformedClasses);
    } catch (err: any) {
      console.error('❌ useCheckIn - Failed to fetch teacher classes:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch classes';
      setClassesError(errorMessage);
      setTeacherClasses([]);
    } finally {
      setIsLoadingClasses(false);
    }
  }, []); // Empty dependency array since it doesn't depend on any state

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return {
    performCheckIn,
    performCheckOut,
    isLoading,
    error,
    success,
    clearMessages,
    // Teacher classes functionality
    teacherClasses,
    isLoadingClasses,
    classesError,
    fetchTeacherClasses
  };
}; 