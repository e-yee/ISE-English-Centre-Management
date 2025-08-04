import type { Contract } from '@/types/contract';

export const mockContracts: Contract[] = [
  {
    id: "CONTRACT-001",
    contract_number: "CTR-2024-001",
    student_name: "John Smith",
    course_name: "Introduction to React",
    start_date: new Date("2024-03-15"),
    end_date: new Date("2024-06-15"),
    total_amount: 299,
    payment_status: "paid",
    contract_status: "active",
    created_date: new Date("2024-02-01"),
    description: "Full payment received for React course"
  },
  {
    id: "CONTRACT-002",
    contract_number: "CTR-2024-002",
    student_name: "Sarah Johnson",
    course_name: "Advanced JavaScript",
    start_date: new Date("2024-04-01"),
    end_date: new Date("2024-05-27"),
    total_amount: 249,
    payment_status: "partial",
    contract_status: "active",
    created_date: new Date("2024-02-15"),
    description: "Partial payment of $150 received, remaining $99 due"
  },
  {
    id: "CONTRACT-003",
    contract_number: "CTR-2024-003",
    student_name: "Michael Brown",
    course_name: "Full Stack Development",
    start_date: new Date("2024-05-01"),
    end_date: new Date("2024-08-26"),
    total_amount: 499,
    payment_status: "unpaid",
    contract_status: "active",
    created_date: new Date("2024-03-01"),
    description: "Payment plan arranged, first payment due April 15"
  },
  {
    id: "CONTRACT-004",
    contract_number: "CTR-2024-004",
    student_name: "Emily Davis",
    course_name: "Python for Data Science",
    start_date: new Date("2024-04-15"),
    end_date: new Date("2024-06-24"),
    total_amount: 349,
    payment_status: "paid",
    contract_status: "completed",
    created_date: new Date("2024-02-20"),
    description: "Course completed successfully, all payments received"
  },
  {
    id: "CONTRACT-005",
    contract_number: "CTR-2024-005",
    student_name: "David Wilson",
    course_name: "UI/UX Design Fundamentals",
    start_date: new Date("2024-03-20"),
    end_date: new Date("2024-05-05"),
    total_amount: 199,
    payment_status: "paid",
    contract_status: "cancelled",
    created_date: new Date("2024-01-15"),
    description: "Contract cancelled due to schedule conflict, refund processed"
  }
]; 