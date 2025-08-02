import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

// Generic hook for role-based data fetching
export function useRoleBasedData<T>(
  queryKey: string[],
  fetchFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) {
  //const { user } = useAuth();
  const mockUser = {
    role: 'teacher',
  };

  return useQuery({
    queryKey: [...queryKey, mockUser?.role],
    queryFn: fetchFn,
    enabled: !!mockUser?.role,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

// Generic hook for any data fetching
export function useDataFetching<T>(
  queryKey: string[],
  fetchFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey,
    queryFn: fetchFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
} 