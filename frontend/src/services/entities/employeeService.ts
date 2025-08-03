import { ApiService } from '../base/apiService';
import { getUserRole, setUserRole } from '../../lib/utils';

export interface Employee {
  id: string;
  name: string;
  full_name: string;
  email: string;
  role: string;
  phone: string;
  phone_number: string;
  teacher_status: string;
  avatar?: string;
  nickname?: string;
  department?: string;
  position?: string;
  achievements?: string[];
  philosophy?: string;
  courses?: string[];
}

class EmployeeService extends ApiService {
  async getAvailableTeachers(): Promise<Employee[]> {
    return this.get<Employee[]>('/employee/teacher/');
  }
  
  async getAllEmployees(): Promise<Employee[]> {
    return this.get<Employee[]>('/employee/');
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