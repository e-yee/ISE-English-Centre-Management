import { ApiService } from '../base/apiService';

export interface CheckInRequest {
  employee_id: string;
  id: string;
  checkin_time: string;
  checkout_time: string | null;
  status: string;
}

export interface CheckInResponse {
  message: string;
  checkin_id?: string;
}

class CheckinService extends ApiService {
  async checkIn(employeeId: string): Promise<CheckInResponse> {
    const id = Date.now().toString();
    const now = new Date().toISOString();
    const data: CheckInRequest = {
      employee_id: employeeId,
      id,
      checkin_time: now,
      checkout_time: null,
      status: 'Pending'
    };
    
    console.log('🔍 CheckInService - Sending check-in request:', data);
    console.log('🔍 CheckInService - Employee ID:', employeeId);
    console.log('🔍 CheckInService - Generated ID:', id);
    
    try {
      const result = await this.post<CheckInResponse>('/checkin/in', data);
      console.log('✅ CheckInService - Success response:', result);
      return result;
    } catch (error) {
      console.error('❌ CheckInService - Error response:', error);
      throw error;
    }
  }
  
  async checkOut(): Promise<CheckInResponse> {
    console.log('🔍 CheckInService - Sending check-out request');
    try {
      const result = await this.put<CheckInResponse>('/checkin/out', {});
      console.log('✅ CheckInService - Check-out success:', result);
      return result;
    } catch (error) {
      console.error('❌ CheckInService - Check-out error:', error);
      throw error;
    }
  }
}

export default new CheckinService(); 