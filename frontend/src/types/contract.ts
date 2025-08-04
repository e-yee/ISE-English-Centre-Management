export interface Contract {
  id: string;
  contract_number: string;
  student_name: string;
  course_name: string;
  start_date: Date;
  end_date: Date;
  total_amount: number;
  payment_status: 'paid' | 'partial' | 'unpaid';
  contract_status: 'active' | 'completed' | 'cancelled';
  created_date: Date;
  description?: string;
}

export interface ContractFormData {
  contract_number: string;
  student_name: string;
  course_name: string;
  start_date: Date;
  end_date: Date;
  total_amount: string;
  payment_status: 'paid' | 'partial' | 'unpaid';
  contract_status: 'active' | 'completed' | 'cancelled';
  description: string;
} 