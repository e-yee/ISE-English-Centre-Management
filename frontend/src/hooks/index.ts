// Auth hooks
export { useAuth } from '../contexts/AuthContext';
export { default as useAuthGuard } from './useAuthGuard';
export { default as useTokenRefresh } from './useTokenRefresh';

// Entity hooks
export { useCheckIn } from './entities/useCheckIn';
export { useStudents, useClassStudents, useDeleteStudent } from './entities/useStudent';
export { useCourses, useCreateCourse } from './entities/useCourses';
export { useIssues, useCreateIssue, useUpdateIssue } from './entities/useIssues';
export { 
  useContracts, 
  useContract, 
  useCreateContract, 
  useUpdateContract, 
  useDeleteContract 
} from './entities/useContracts';

// Legacy hook (for backward compatibility)
export { default as useAuthFlow } from './useAuthFlow'; 