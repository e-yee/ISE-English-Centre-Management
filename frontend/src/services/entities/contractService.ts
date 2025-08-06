import { ApiService } from '../base/apiService';
import { getUserRole } from '../../lib/utils';
import type { Contract, CreateContractData, UpdateContractData, ContractResponse } from '../../types/contract';

class ContractService extends ApiService {
  async getAllContracts(courseId: string, courseDate: string): Promise<ContractResponse[]> {
    const userRole = getUserRole();
    
    if (userRole === 'Learning Advisor') {
      return this.get<ContractResponse[]>(`/contract/learningadvisor/?course_id=${courseId}&course_date=${courseDate}`);
    } else if (userRole === 'Manager') {
      return this.get<ContractResponse[]>(`/contract/manager/?course_id=${courseId}&course_date=${courseDate}`);
    }
    
    throw new Error('Unauthorized access to contracts');
  }
  
  async getContract(id: string): Promise<ContractResponse> {
    const userRole = getUserRole();
    
    if (userRole === 'Learning Advisor') {
      return this.get<ContractResponse>(`/contract/learningadvisor/search?id=${id}`);
    } else if (userRole === 'Manager') {
      return this.get<ContractResponse>(`/contract/manager/search?id=${id}`);
    }
    
    throw new Error('Unauthorized access to contract');
  }
  
  async createContract(contractData: CreateContractData): Promise<ContractResponse> {
    const userRole = getUserRole();
    
    if (userRole !== 'Learning Advisor') {
      throw new Error('Only Learning Advisors can create contracts');
    }
    
    return this.post<ContractResponse>('/contract/learningadvisor/add', contractData);
  }

  async updateContract(id: string, contractData: UpdateContractData): Promise<{ message: string }> {
    const userRole = getUserRole();
    
    if (userRole !== 'Learning Advisor') {
      throw new Error('Only Learning Advisors can update contracts');
    }
    
    return this.put<{ message: string }>(`/contract/learningadvisor/update?id=${id}`, contractData);
  }

  async deleteContract(id: string): Promise<{ message: string }> {
    const userRole = getUserRole();
    
    if (userRole !== 'Learning Advisor') {
      throw new Error('Only Learning Advisors can delete contracts');
    }
    
    return this.delete<{ message: string }>(`/contract/learningadvisor/delete?id=${id}`);
  }

  async getContractsByRole(courseId?: string, courseDate?: string): Promise<ContractResponse[]> {
    if (!courseId || !courseDate) {
      return [];
    }
    
    return this.getAllContracts(courseId, courseDate);
  }
}

export default new ContractService(); 