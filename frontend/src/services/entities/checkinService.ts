import { ApiService } from '../base/apiService';

export interface CheckInRequest {
  employee_id: string;
  id: string;
  checkin_time: string;
  checkout_time: string;
  status: string;
}

export interface CheckInResponse {
  message: string;
  checkin_id?: string;
}

// New interface for teacher classes
export interface TeacherClass {
  id: string;
  course_id: string;
  course_date: string;
  term: number;
  teacher_id: string;
  room_id: string;
  class_date: string;
}

class CheckinService extends ApiService {
  async checkIn(employeeId: string): Promise<CheckInResponse> {
    // Generate shorter ID that fits VARCHAR(10) constraint
    const id = Math.random().toString(36).substring(2, 12);
    
    // Format datetime in ISO 8601 format with timezone for marshmallow compatibility
    const now = new Date();
    const formattedDateTime = now.toISOString(); // Include timezone information
    
    const data: CheckInRequest = {
      employee_id: employeeId,
      id,
      checkin_time: formattedDateTime,
      checkout_time: formattedDateTime, // Send same time since it's required but will be overridden
      status: 'Pending'
    };
    
    console.log('🔍 CheckInService - Sending check-in request:', data);
    console.log('🔍 CheckInService - Employee ID:', employeeId);
    console.log('🔍 CheckInService - Generated ID:', id);
    console.log('🔍 CheckInService - Formatted datetime:', formattedDateTime);
    
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

  // New method to get teacher classes
  async getTeacherClasses(): Promise<TeacherClass[]> {
    console.log('🔍 CheckInService - Fetching teacher classes');
    try {
      const result = await this.get<TeacherClass[]>('/class/teacher/');
      console.log('✅ CheckInService - Teacher classes fetched:', result);
      return result;
    } catch (error) {
      console.error('❌ CheckInService - Error fetching teacher classes:', error);
      throw error;
    }
  }
}

export default new CheckinService(); 