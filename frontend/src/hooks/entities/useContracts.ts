import { useDataFetching } from '../base/useDataFetching';
import contractService, { type CreateContractData, type UpdateContractData } from '@/services/entities/contractService';
import type { Contract, ContractResponse } from '@/types/contract';
import { useState } from 'react';

export function useContracts(courseId?: string, courseDate?: string) {
  return useDataFetching(
    ['contracts', courseId, courseDate],
    () => {
      console.log('fetching contracts for course:', courseId, courseDate);
      if (!courseId || !courseDate) {
        return Promise.resolve([]);
      }
      return contractService.getContractsByRole(courseId, courseDate);
    },
    {
      enabled: !!courseId && !!courseDate
    }
  );
}

export function useContract(id: string) {
  return useDataFetching(
    ['contract', id],
    () => {
      console.log('fetching contract:', id);
      return contractService.getContract(id);
    },
    {
      enabled: !!id
    }
  );
}

export function useCreateContract() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createContract = async (contractData: CreateContractData): Promise<ContractResponse | null> => {
    setIsCreating(true);
    setError(null);
    
    try {
      console.log('🔍 useCreateContract: Creating contract with data:', contractData);
      const createdContract = await contractService.createContract(contractData);
      console.log('🔍 useCreateContract: Contract created successfully:', createdContract);
      return createdContract;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create contract';
      console.error('❌ useCreateContract: Error creating contract:', err);
      setError(errorMessage);
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createContract,
    isCreating,
    error
  };
}

export function useUpdateContract() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateContract = async (id: string, contractData: UpdateContractData): Promise<boolean> => {
    setIsUpdating(true);
    setError(null);
    
    try {
      console.log('🔍 useUpdateContract: Updating contract:', id, 'with data:', contractData);
      await contractService.updateContract(id, contractData);
      console.log('🔍 useUpdateContract: Contract updated successfully');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update contract';
      console.error('❌ useUpdateContract: Error updating contract:', err);
      setError(errorMessage);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateContract,
    isUpdating,
    error
  };
}

export function useDeleteContract() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteContract = async (id: string): Promise<boolean> => {
    setIsDeleting(true);
    setError(null);
    
    try {
      console.log('🔍 useDeleteContract: Deleting contract:', id);
      await contractService.deleteContract(id);
      console.log('🔍 useDeleteContract: Contract deleted successfully');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete contract';
      console.error('❌ useDeleteContract: Error deleting contract:', err);
      setError(errorMessage);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteContract,
    isDeleting,
    error
  };
} 