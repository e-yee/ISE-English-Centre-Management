export interface Contract {
  id: string;
  student_id: string;
  employee_id: string;
  course_id: string;
  course_date: Date;
  tuition_fee: number;
  payment_status: 'In Progress' | 'Paid';
  start_date: Date;
  end_date: Date;
  // UI display fields (computed from relationships)
  student_name?: string;
  course_name?: string;
  employee_name?: string;
  contract_number?: string;
  description?: string;
}

export interface ContractFormData {
  student_id: string;
  course_id: string;
  course_date: Date;
  tuition_fee: string;
  start_date: Date;
  end_date: Date;
  payment_status: 'In Progress' | 'Paid';
  description?: string;
}

// New interfaces for API operations
export interface CreateContractData {
  student_id: string;
  course_id: string;
  course_date: string; // ISO date string for API
}

export interface UpdateContractData {
  student_id?: string;
  course_id?: string;
  course_date?: string; // ISO date string for API
}

export interface ContractResponse {
  id: string;
  student_id: string;
  employee_id: string;
  course_id: string;
  course_date: string;
  tuition_fee: number;
  payment_status: 'In Progress' | 'Paid';
  start_date: string;
  end_date: string;
  student?: {
    fullname: string;
  };
} 