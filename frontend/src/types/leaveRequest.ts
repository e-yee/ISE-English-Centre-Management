export interface LeaveRequest {
  id: string;
  employee_id: string;
  substitute_id?: string;
  start_date: string; // Date as string from API
  end_date: string; // Date as string from API
  reason: string;
  status: 'Approved' | 'Not Approved'; // Backend status values
  created_date: string; // Date as string from API
}

// Frontend display interface for easier handling
export interface LeaveRequestDisplay {
  id: string; // Now represents employee_id instead of leave request id
  employeeName: string; // Format: "Name-id" (e.g., "John Doe-EM001")
  substituteName: string; // Format: "Name-id" (e.g., "Jane Smith-EM002")
  startDate: Date;
  endDate: Date;
  reason: string;
  status: 'Approved' | 'Not Approved'; // Use backend status format directly
  createdDate: Date;
} 

// Input payload for creating leave request (substitute optional for Learning Advisor)
export type CreateLeaveRequestInput = Pick<LeaveRequest, 'start_date' | 'end_date' | 'reason'> & Partial<Pick<LeaveRequest, 'substitute_id'>>;