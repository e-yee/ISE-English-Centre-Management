import { useRoleBasedData, useDataFetching } from '../base/useDataFetching';
import employeeService from '@/services/entities/employeeService';

export function useEmployees() {
  return useRoleBasedData(
    ['employees'],
    () => employeeService.getEmployeesByRole()
  );
}

export function useAvailableTeachers() {
  return useDataFetching(
    ['employees', 'available'],
    () => employeeService.getAvailableTeachers()
  );
} 