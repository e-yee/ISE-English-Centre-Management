import { ApiService } from '../base/apiService';
import { getUserRole } from '../../lib/utils';

export interface Student {
  id: string;
  fullname: string;
  contact_info: string;
  date_of_birth: string;
}

class StudentService extends ApiService {
  async getAllStudents(): Promise<Student[]> {
    return this.get<Student[]>('/student/');
  }
  
  async getClassStudents(classId: string, courseId: string, courseDate: string, term: string): Promise<Student[]> {
    return this.get<Student[]>(`/student/class/?class_id=${classId}&course_id=${courseId}&course_date=${courseDate}&term=${term}`);
  }

  async getStudentsByRole(classId?: string, courseId?: string, courseDate?: string, term?: string): Promise<Student[]> {
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
        if (classId && courseId && courseDate && term) {
          console.log('🔍 Calling getClassStudents with classId:', classId);
          return this.getClassStudents(classId, courseId, courseDate, term);
        } else {
          console.log('⚠️ Teacher role but missing required parameters');
          return [];
        }
      default:
        console.log('⚠️ Falling to default, role not matched');
        return [];
    }
  }
}

export default new StudentService(); 