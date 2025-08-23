// Backend class structure
export interface BackendClassData {
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
}

// Frontend class structure for UI components
export interface ClassData {
  id: string;
  className: string;
  courseId: string;
  room: string;
  time: string;
  status: 'Today' | 'Tomorrow' | 'Coming soon' | 'Expired' | string;
  statusColor: 'today' | 'tomorrow' | 'coming-soon' | 'expired' | 'custom';
} 