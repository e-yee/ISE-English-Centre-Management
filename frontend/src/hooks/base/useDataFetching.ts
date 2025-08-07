import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

// Generic hook for role-based data fetching
export function useRoleBasedData<T>(
  queryKey: string[],
  fetchFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) {
  const { user } = useAuth();

  return useQuery({
    queryKey: [...queryKey, user?.role],
    queryFn: fetchFn,
    enabled: !!user?.role,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

// Generic hook for any data fetching - now includes role in query key
export function useDataFetching<T>(
  queryKey: string[],
  fetchFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) {
  const { user } = useAuth();

  return useQuery({
    queryKey: [...queryKey, user?.role], // Include role in query key
    queryFn: fetchFn,
    enabled: !!user?.role, // Only enable when user role is available
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
} 