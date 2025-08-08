import { ApiService } from '../base/apiService';
import { getUserRole } from '../../lib/utils';
import type { Student } from '@/types/student';

export interface CreateStudentData {
  fullname: string;
  contact_info: string;
  date_of_birth: string; // YYYY-MM-DD
}

export type UpdateStudentData = Partial<CreateStudentData>;

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

  async createStudent(data: CreateStudentData): Promise<Student> {
    return this.post<Student>('/student/learningadvisor/add', data);
  }

  async updateStudent(id: string, data: UpdateStudentData): Promise<{ message: string }> {
    return this.put<{ message: string }>(`/student/learningadvisor/update?id=${encodeURIComponent(id)}`, data);
  }

  async deleteStudent(id: string): Promise<{ message: string }> {
    return this.delete<{ message: string }>(`/student/learningadvisor/delete?id=${encodeURIComponent(id)}`);
  }
}

export default new StudentService(); 