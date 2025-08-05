export interface LeaveRequest {
  id: string;
  employee_id: string;
  substitute_id: string;
  start_date: string; // Date as string from API
  end_date: string; // Date as string from API
  reason: string;
  status: 'Approved' | 'Not Approved'; // Backend status values
  created_date: string; // Date as string from API
}

// Frontend display interface for easier handling
export interface LeaveRequestDisplay {
  id: string;
  employeeName: string;
  substituteName: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: 'pending' | 'approved' | 'rejected'; // Frontend status mapping
  createdDate: Date;
} 