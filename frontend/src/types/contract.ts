export interface Contract {
  id: string;
  student_id: string;
  course_id: string;
  course_date: Date | string;
  tuition_fee: number;
  payment_status: 'In Progress' | 'Paid';
  // UI display fields (computed from relationships)
  student_name?: string;
  course_name?: string;
  contract_number?: string;
  description?: string;
}

export interface ContractFormData {
  student_id: string;
  course_id: string;
  course_date: Date;
  tuition_fee: string;
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
  course_id: string;
  course_date: string;
  tuition_fee: number;
  payment_status: 'In Progress' | 'Paid';
  student?: {
    fullname: string;
  };
} 