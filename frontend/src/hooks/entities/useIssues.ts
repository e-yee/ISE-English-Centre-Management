import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRoleBasedData } from '../base/useDataFetching';
import issueService from '@/services/entities/issueService';
import type { Issue, IssueFormData } from '@/types/issue';

// Hook for role-based issues fetching
export function useIssues() {
  return useRoleBasedData(
    ['issues'],
    async () => {
      console.log('🔍 Fetching issues by role');
      try {
        const result = await issueService.getIssuesByRole();
        console.log('✅ Issues fetched successfully:', result);
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
      } catch (error: any) {
        console.error('❌ Error fetching issues:', error);
        
        // Handle 404 "No issues found" responses gracefully
        if (error.message && (
          error.message.includes('No issues found') ||
          error.message.includes('No issues found for this teacher')
        )) {
          console.log('📝 No issues found, returning empty array');
          return [];
        }
        
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

// Hook for creating new issue (Teacher only)
export function useCreateIssue() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const createIssue = async (issueData: IssueFormData): Promise<Issue | null> => {
    console.log('🔍 Creating issue:', issueData);
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        const result = await issueService.createIssue(issueData);
        console.log('✅ Issue created successfully:', result);
        setSuccess('Issue created successfully');
        setIsLoading(false);
        
        // Invalidate and refetch issues
        queryClient.invalidateQueries({ queryKey: ['issues'] });
        
        return result;
      } catch (err: any) {
        retryCount++;
        console.error(`❌ Issue creation failed (attempt ${retryCount}):`, err);
        
        if (retryCount >= maxRetries) {
          const errorMessage = err.response?.data?.message || err.message || 'Failed to create issue';
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
    createIssue,
    isLoading,
    error,
    success,
    clearMessages
  };
}

// Hook for updating issue status to "Done" (Learning Advisor and Manager only)
export function useUpdateIssue() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const updateIssue = async (id: string): Promise<Issue | null> => {
    console.log('🔍 Updating issue:', { id });
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        const result = await issueService.updateIssue(id);
        console.log('✅ Issue updated successfully:', result);
        setSuccess('Issue marked as done successfully');
        setIsLoading(false);
        
        // Invalidate and refetch issues
        queryClient.invalidateQueries({ queryKey: ['issues'] });
        
        return result;
      } catch (err: any) {
        retryCount++;
        console.error(`❌ Issue update failed (attempt ${retryCount}):`, err);
        
        if (retryCount >= maxRetries) {
          const errorMessage = err.response?.data?.message || err.message || 'Failed to update issue';
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
    updateIssue,
    isLoading,
    error,
    success,
    clearMessages
  };
} 