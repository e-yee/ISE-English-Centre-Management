import { ApiService } from '../base/apiService';
import { getUserRole } from '../../lib/utils';

export interface Class {
  id: string;
  course_id: string;
  course_date: string;
  term: number;
  teacher_id: string;
  room_id: string;
  class_date: string;
  course?: {
    name: string;
  };
  teacher?: {
    full_name: string;
  };
  room?: {
    name: string;
  };
  student_count?: number;
}

class ClassService extends ApiService {
  async getAllClasses(): Promise<Class[]> {
    return this.get<Class[]>('/class/');
  }
  
  async getTeacherClasses(): Promise<Class[]> {
    // Placeholder for future implementation
    return this.get<Class[]>('/class/teacher/');
  }

  async getAllClassesByCourse(courseId: string, courseDate: string): Promise<Class[]> {
    const userRole = getUserRole();
    
    if (userRole === 'Learning Advisor') {
      return this.get<Class[]>(`/class/learningadvisor/?course_id=${courseId}&course_date=${courseDate}`);
    } else if (userRole === 'Manager') {
      return this.get<Class[]>(`/class/manager/?course_id=${courseId}&course_date=${courseDate}`);
    }
    
    throw new Error('Unauthorized access to classes');
  }

  async createClass(payload: {
    course_id: string;
    course_date: string; // YYYY-MM-DD
    term: number;
    teacher_id: string;
    room_id: string;
    class_date: string; // YYYY-MM-DD HH:MM:SS
  }): Promise<Class> {
    return this.post<Class>('/class/learningadvisor/add', payload);
  }

  async getClassesByRole(): Promise<Class[]> {
    console.log('🔍 getClassesByRole called');
    
    const userRole = getUserRole();
  
    console.log('🔍 localStorage user:', userRole);
    
    switch (userRole) {
      case 'Learning Advisor':
        console.log('🔍 Calling getAllClasses');
        return this.getAllClasses();
      case 'Teacher':
        console.log('🔍 Calling getTeacherClasses (placeholder)');
        return this.getTeacherClasses();
      default:
        console.log('⚠️ Falling to default, role not matched');
        return [];
    }
  }
}

export default new ClassService(); 