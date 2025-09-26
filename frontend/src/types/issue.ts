export interface Issue {
  id: string;                    // Auto-generated (ISS001, ISS002, etc.)
  teacher_id: string;            // Format: EMP001, EMP002, etc.
  issue_type: 'Student Behavior' | 'Technical';  // Required, restricted values
  issue_description: string;     // Required
  status: 'In Progress' | 'Done';      // Default: 'In Progress'
  reported_date: string;        // Auto-generated, current date (YYYY-MM-DD)
  student_id: string | null;    // Required ONLY if issue_type is "Student Behavior"
  room_id: string | null;       // Required ONLY if issue_type is "Technical"
}

export interface IssueDisplay {
  id: string;
  teacherName: string;          // Resolved from teacher_id
  issueType: 'Student Behavior' | 'Technical';
  description: string;
  status: 'In Progress' | 'Done';
  reportedDate: Date;
  studentName?: string;         // Resolved from student_id (only for Student Behavior)
  roomName?: string;           // Resolved from room_id (only for Technical)
}

export interface IssueFormData {
  teacher_id: string;           // Required - will be set from JWT token
  issue_type: 'Student Behavior' | 'Technical' | '';
  issue_description: string;
  student_id: string | null;
  room_id: string | null;
}

// Helper interfaces for resolving IDs to names
export interface Teacher {
  id: string;
  name: string;
}

export interface Student {
  id: string;
  name: string;
}

export interface Room {
  id: string;
  name: string;
}