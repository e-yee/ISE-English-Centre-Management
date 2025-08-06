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