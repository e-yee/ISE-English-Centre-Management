import type { Contract } from '@/types/contract';

export const mockContracts: Contract[] = [
  {
    id: "CON001",
    student_id: "STU001",
    employee_id: "EMP001",
    course_id: "CRS001",
    course_date: new Date("2024-02-01"),
    tuition_fee: 299,
    payment_status: "Paid",
    start_date: new Date("2024-03-15"),
    end_date: new Date("2024-06-15"),
    description: "Full payment received for React course"
  },
  {
    id: "CON002",
    student_id: "STU002",
    employee_id: "EMP001",
    course_id: "CRS002",
    course_date: new Date("2024-02-15"),
    tuition_fee: 249,
    payment_status: "In Progress",
    start_date: new Date("2024-04-01"),
    end_date: new Date("2024-05-27"),
    description: "Partial payment of $150 received, remaining $99 due"
  },
  {
    id: "CON003",
    student_id: "STU003",
    employee_id: "EMP002",
    course_id: "CRS003",
    course_date: new Date("2024-03-01"),
    tuition_fee: 499,
    payment_status: "In Progress",
    start_date: new Date("2024-05-01"),
    end_date: new Date("2024-08-26"),
    description: "Payment plan arranged, first payment due April 15"
  },
  {
    id: "CON004",
    student_id: "STU004",
    employee_id: "EMP001",
    course_id: "CRS004",
    course_date: new Date("2024-02-20"),
    tuition_fee: 349,
    payment_status: "Paid",
    start_date: new Date("2024-04-15"),
    end_date: new Date("2024-06-24"),
    description: "Course completed successfully, all payments received"
  },
  {
    id: "CON005",
    student_id: "STU005",
    employee_id: "EMP002",
    course_id: "CRS005",
    course_date: new Date("2024-01-15"),
    tuition_fee: 199,
    payment_status: "Paid",
    start_date: new Date("2024-03-20"),
    end_date: new Date("2024-05-05"),
    description: "Contract completed successfully"
  },
  {
    id: "CON006",
    student_id: "STU006",
    employee_id: "EMP007",
    course_id: "CRS006",
    course_date: new Date("2024-04-01"),
    tuition_fee: 399,
    payment_status: "In Progress",
    start_date: new Date("2024-06-01"),
    end_date: new Date("2024-08-31"),
    description: "Backend development course in progress"
  },
  {
    id: "CON007",
    student_id: "STU007",
    employee_id: "EMP002",
    course_id: "CRS007",
    course_date: new Date("2024-05-01"),
    tuition_fee: 599,
    payment_status: "Paid",
    start_date: new Date("2024-07-01"),
    end_date: new Date("2024-10-31"),
    description: "Mobile app development course - full payment received"
  },
  {
    id: "CON008",
    student_id: "STU008",
    employee_id: "EMP007",
    course_id: "CRS008",
    course_date: new Date("2024-03-15"),
    tuition_fee: 299,
    payment_status: "In Progress",
    start_date: new Date("2024-05-15"),
    end_date: new Date("2024-07-15"),
    description: "Database design course - payment plan in place"
  }
]; 