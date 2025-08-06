import type { LeaveRequest, LeaveRequestDisplay } from '@/types/leaveRequest';

// Mock data matching backend schema
export const leaveRequestMock: LeaveRequest[] = [
  {
    id: "LR001",
    employee_id: "EMP001",
    substitute_id: "EMP002", 
    start_date: "2024-01-15",
    end_date: "2024-01-17",
    reason: "Sick leave - flu symptoms",
    status: "Approved",
    created_date: "2024-01-10"
  },
  {
    id: "LR002",
    employee_id: "EMP001",
    substitute_id: "EMP003",
    start_date: "2024-02-20",
    end_date: "2024-02-22",
    reason: "Personal vacation",
    status: "Not Approved",
    created_date: "2024-02-15"
  },
  {
    id: "LR003",
    employee_id: "EMP001",
    substitute_id: "EMP004",
    start_date: "2024-03-10",
    end_date: "2024-03-12",
    reason: "Medical appointment",
    status: "Approved",
    created_date: "2024-03-05"
  },
  {
    id: "LR004",
    employee_id: "EMP001",
    substitute_id: "EMP005",
    start_date: "2024-04-05",
    end_date: "2024-04-07",
    reason: "Family emergency",
    status: "Not Approved",
    created_date: "2024-04-01"
  },
  {
    id: "LR005",
    employee_id: "EMP001",
    substitute_id: "EMP006",
    start_date: "2024-05-12",
    end_date: "2024-05-14",
    reason: "Professional development conference",
    status: "Approved",
    created_date: "2024-05-08"
  }
];

// Convert backend data to frontend display format
export const leaveRequestDisplayMock: LeaveRequestDisplay[] = leaveRequestMock.map(request => ({
  id: request.id,
  employeeName: "John Smith", // Mock employee name
  substituteName: "Jane Doe", // Mock substitute name
  startDate: new Date(request.start_date),
  endDate: new Date(request.end_date),
  reason: request.reason,
  status: request.status === 'Approved' ? 'approved' : 'rejected', // Map backend status to frontend
  createdDate: new Date(request.created_date)
})); 