export interface Course {
  id: string;
  name: string;
  duration: number;
  start_date: Date;
  schedule: string;
  fee: number;
  prerequisites: string;
  created_date: Date;
  description?: string;
}

export interface CourseFormData {
  name: string;
  duration: string;
  start_date: Date;
  schedule: string;
  fee: string;
  prerequisites: string;
  description: string;
} 