import { ApiService } from '../base/apiService';
import { getUserRole, setUserRole } from '../../lib/utils';

export interface Employee {
  id?: string; // Backend schema missing this
  name?: string; // Not in backend schema
  full_name: string;
  email: string;
  role: string;
  phone?: string; // Not in backend schema
  nickname?: string;
  philosophy?: string;
  achievements?: string;
  phone_number?: string;
  teacher_status?: string;
  avatar?: string; // Not in backend schema
  department?: string; // Not in backend schema
  position?: string; // Not in backend schema
  courses?: string[]; // Not in backend schema
}

export interface ProfileData {
  full_name: string;
  email: string;
  nickname?: string | null;
  philosophy?: string | null;
  achievements?: string | null;
  role: string;
  phone_number?: string | null;
  teacher_status?: string | null;
}

class EmployeeService extends ApiService {
  async getAvailableTeachers(): Promise<Employee[]> {
    return this.get<Employee[]>('/employee/teacher/');
  }
  
  async getAllEmployees(): Promise<Employee[]> {
    return this.get<Employee[]>('/employee/manager/');
  }

  async getProfile(): Promise<ProfileData> {
    return this.get<ProfileData>('/employee/profile');
  }

  async updateProfile(profileData: Partial<ProfileData>): Promise<{ message: string }> {
    return this.put<{ message: string }>('/employee/update', profileData);
  }

//   async getEmployeesByRole(): Promise<Employee[]> {
//     const user = JSON.parse(localStorage.getItem('user') || '{}');
    
//     switch (user.role) {
//       case 'Teacher':
//         return this.getAvailableTeachers();
//       case 'manager':
//         return this.getAllEmployees();
//       default:
//         return [];
//     }
//   }
// }

  async getEmployeesByRole(): Promise<Employee[]> {
    console.log('�� getEmployeesByRole called');
    
    const userRole = getUserRole();
  
    console.log('🔍 localStorage user:', userRole);
    
    switch (userRole) {
      case 'Teacher':
        console.log('🔍 Calling getAvailableTeachers');
        return this.getAvailableTeachers();
      case 'Manager':
        console.log('🔍 Calling getAllEmployees');
        return this.getAllEmployees();
      default:
        console.log('⚠️ Falling to default, role not matched');
        return [];
    }
  }
}

export default new EmployeeService(); 