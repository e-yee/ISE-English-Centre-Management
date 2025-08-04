import { ApiService } from '../base/apiService';
import { getUserRole } from '../../lib/utils';

export interface Student {
  id: string;
  fullname: string;
  contact_info: string;
  date_of_birth: string;
  created_date: string;
}

class StudentService extends ApiService {
  async getAllStudents(): Promise<Student[]> {
    return this.get<Student[]>('/student/');
  }
  
  async getClassStudents(classId: string): Promise<Student[]> {
    return this.get<Student[]>(`/student/teacher/?id=${classId}`);
  }

  async getStudentsByRole(classId?: string): Promise<Student[]> {
    console.log('🔍 getStudentsByRole called');
    
    const userRole = getUserRole();
  
    console.log('🔍 localStorage user:', userRole);
    
    switch (userRole) {
      case 'Learning Advisor':
        console.log('🔍 Calling getAllStudents');
        return this.getAllStudents();
      case 'Manager':
        console.log('🔍 Calling getAllStudents');
        return this.getAllStudents();
      case 'Teacher':
        if (classId) {
          console.log('🔍 Calling getClassStudents with classId:', classId);
          return this.getClassStudents(classId);
        } else {
          console.log('⚠️ Teacher role but no classId provided');
          return [];
        }
      default:
        console.log('⚠️ Falling to default, role not matched');
        return [];
    }
  }
}

export default new StudentService(); 