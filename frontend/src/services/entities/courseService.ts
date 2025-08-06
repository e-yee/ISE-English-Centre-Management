import { ApiService } from '../base/apiService';
import { getUserRole } from '../../lib/utils';
import type { Course } from '../../types/course';

export interface CreateCourseData {
  name: string;
  duration: number;
  start_date: string; // ISO date string
  schedule: string;
  fee: number;
  prerequisites: string;
  created_date: string; // ISO date string
  description?: string;
}

class CourseService extends ApiService {
  async getAllCourses(): Promise<Course[]> {
    return this.get<Course[]>('/course/learningadvisor/');
  }
  
  async getAllCoursesForManager(): Promise<Course[]> {
    return this.get<Course[]>('/course/manager/');
  }
  
  async getCourseForManager(courseId: string, courseDate: string): Promise<Course> {
    return this.get<Course>(`/course/manager/search?id=${courseId}&course_date=${courseDate}`);
  }
  
  async createCourse(courseData: CreateCourseData): Promise<Course> {
    console.log('🔍 createCourse called with data:', courseData);
    
    const userRole = getUserRole();
    console.log('🔍 localStorage user role:', userRole);
    
    if (userRole !== 'Learning Advisor') {
      throw new Error('Only Learning Advisors can create courses');
    }
    
    return this.post<Course>('/course/learningadvisor/add', courseData);
  }

  async getCoursesByRole(): Promise<Course[]> {
    console.log('🔍 getCoursesByRole called');
    
    const userRole = getUserRole();
    console.log('🔍 localStorage user:', userRole);
    
    switch (userRole) {
      case 'Learning Advisor':
        console.log('🔍 Calling getAllCourses');
        return this.getAllCourses();
      case 'Manager':
        console.log('🔍 Calling getAllCoursesForManager');
        return this.getAllCoursesForManager();
      default:
        console.log('⚠️ Falling to default, role not matched');
        return [];
    }
  }
}

export default new CourseService(); 