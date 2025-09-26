import { useRoleBasedData, useDataFetching } from '../base/useDataFetching';
import employeeService, { type ProfileData } from '@/services/entities/employeeService';
import { useState } from 'react';

export function useEmployees() {


  return useRoleBasedData(
    ['employees'],
    () => {
      console.log('fetching employees');
      return employeeService.getEmployeesByRole();
    }
  );
}

export function useAvailableTeachers() {
  return useDataFetching(
    ['employees', 'available'],
    () => employeeService.getAvailableTeachers()
  );
}

export function useProfile() {
  return useDataFetching(
    ['profile'],
    () => employeeService.getProfile()
  );
} 

export function useUpdateProfile() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (data: Partial<ProfileData>): Promise<boolean> => {
    setIsUpdating(true);
    setError(null);
    try {
      await employeeService.updateProfile(data);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      setError(message);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateProfile, isUpdating, error };
}