import { ApiService } from '../base/apiService';
import { getUserRole } from '../../lib/utils';
import type{ LeaveRequest } from '../../types/leaveRequest';

class LeaveRequestService extends ApiService {
  // For Teacher/Learning Advisor - get their personal requests
  async getPersonalRequests(): Promise<LeaveRequest[]> {
    return this.get<LeaveRequest[]>('/leave_request/personal_lr/');
  }

  // For Manager - get all requests
  async getAllRequests(): Promise<LeaveRequest[]> {
    return this.get<LeaveRequest[]>('/leave_request/');
  }

  // For Teacher/Learning Advisor - create new request
  async createRequest(requestData: Omit<LeaveRequest, 'id' | 'status' | 'created_date'>): Promise<LeaveRequest> {
    return this.post<LeaveRequest>('/leave_request/create', requestData);
  }

  // For Manager - approve/reject request
  async approveRequest(id: string, status: 'Approved' | 'Not Approved'): Promise<LeaveRequest> {
    return this.put<LeaveRequest>(`/leave_request/approve/${id}`, { status });
  }

  // Role-based method to get appropriate requests
  async getRequestsByRole(): Promise<LeaveRequest[]> {
    const userRole = getUserRole();
    
    switch (userRole) {
      case 'Teacher':
      case 'Learning Advisor':
        return this.getPersonalRequests();
      case 'Manager':
        return this.getAllRequests();
      default:
        console.warn('⚠️ Unknown role for leave requests:', userRole);
        return [];
    }
  }
}

export default new LeaveRequestService(); 