import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRoleBasedData } from '../base/useDataFetching';
import leaveRequestService from '@/services/entities/leaveRequestService';
import type { LeaveRequest } from '@/types/leaveRequest';

// Hook for role-based leave requests fetching
export function useLeaveRequests() {
  return useRoleBasedData(
    ['leaveRequests'],
    async () => {
      console.log('🔍 Fetching leave requests by role');
      try {
        const result = await leaveRequestService.getRequestsByRole();
        console.log('✅ Leave requests fetched successfully:', result);
        console.log('📊 Result type:', typeof result);
        console.log('📊 Is array:', Array.isArray(result));
        
        // Handle case where API returns an object with data property
        if (result && typeof result === 'object' && !Array.isArray(result)) {
          console.log('📊 Result keys:', Object.keys(result));
          // Check if it has a data property
          if ('data' in result && Array.isArray((result as any).data)) {
            console.log('📊 Extracting data from response object');
            return (result as any).data;
          }
          // If it's a single object, wrap it in an array
          if ('id' in result) {
            console.log('📊 Single object detected, wrapping in array');
            return [result];
          }
        }
        
        return result;
      } catch (error) {
        console.error('❌ Error fetching leave requests:', error);
        throw error;
      }
    },
    {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 2 * 60 * 1000, // 2 minutes
      gcTime: 5 * 60 * 1000, // 5 minutes (replaces cacheTime)
    }
  );
}

// Hook for creating new leave request
export function useCreateLeaveRequest() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const createRequest = async (requestData: Omit<LeaveRequest, 'id' | 'status' | 'created_date' | 'employee_id'>): Promise<LeaveRequest | null> => {
    console.log('🔍 Creating leave request:', requestData);
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        const result = await leaveRequestService.createRequest(requestData);
        console.log('✅ Leave request created successfully:', result);
        setSuccess('Leave request created successfully');
        setIsLoading(false);
        
        // Invalidate and refetch leave requests
        queryClient.invalidateQueries({ queryKey: ['leaveRequests'] });
        
        return result;
      } catch (err: any) {
        retryCount++;
        console.error(`❌ Leave request creation failed (attempt ${retryCount}):`, err);
        
        if (retryCount >= maxRetries) {
          const errorMessage = err.response?.data?.message || err.message || 'Failed to create leave request';
          setError(errorMessage);
          setIsLoading(false);
          return null;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      }
    }
    
    setIsLoading(false);
    return null;
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return {
    createRequest,
    isLoading,
    error,
    success,
    clearMessages
  };
}

// Hook for approving/rejecting leave request (Manager only)
export function useApproveLeaveRequest() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const approveRequest = async (id: string, status: 'Approved' | 'Not Approved'): Promise<LeaveRequest | null> => {
    console.log('🔍 Approving leave request:', { id, status });
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        const result = await leaveRequestService.approveRequest(id, status);
        console.log('✅ Leave request approval successful:', result);
        setSuccess(`Leave request ${status.toLowerCase()} successfully`);
        setIsLoading(false);
        
        // Invalidate and refetch leave requests
        queryClient.invalidateQueries({ queryKey: ['leaveRequests'] });
        
        return result;
      } catch (err: any) {
        retryCount++;
        console.error(`❌ Leave request approval failed (attempt ${retryCount}):`, err);
        
        if (retryCount >= maxRetries) {
          const errorMessage = err.response?.data?.message || err.message || 'Failed to approve leave request';
          setError(errorMessage);
          setIsLoading(false);
          return null;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      }
    }
    
    setIsLoading(false);
    return null;
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return {
    approveRequest,
    isLoading,
    error,
    success,
    clearMessages
  };
} 