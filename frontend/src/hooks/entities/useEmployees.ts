import { useRoleBasedData, useDataFetching } from '../base/useDataFetching';
import employeeService from '@/services/entities/employeeService';

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