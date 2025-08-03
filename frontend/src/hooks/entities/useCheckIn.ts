import { useState } from 'react';
import checkinService from '@/services/entities/checkinService';
import type { CheckInResponse } from '@/services/entities/checkinService';

export const useCheckIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
    clearMessages
  };
}; 