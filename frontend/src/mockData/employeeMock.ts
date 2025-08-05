export interface Employee {
  id: string;
  fullname: string;
  email: string;
  role: 'Teacher' | 'Learning Advisor' | 'Manager';
  contact_info: string;
  created_date: Date;
}

export const mockEmployees: Employee[] = [
  {
    id: "EMP001",
    fullname: "Sarah Johnson",
    email: "sarah.johnson@ise.edu",
    role: "Learning Advisor",
    contact_info: "+1-555-0101",
    created_date: new Date("2023-01-15")
  },
  {
    id: "EMP002",
    fullname: "David Wilson",
    email: "david.wilson@ise.edu",
    role: "Learning Advisor",
    contact_info: "+1-555-0102",
    created_date: new Date("2023-02-01")
  },
  {
    id: "EMP003",
    fullname: "Maria Garcia",
    email: "maria.garcia@ise.edu",
    role: "Teacher",
    contact_info: "+1-555-0103",
    created_date: new Date("2023-01-20")
  },
  {
    id: "EMP004",
    fullname: "James Chen",
    email: "james.chen@ise.edu",
    role: "Teacher",
    contact_info: "+1-555-0104",
    created_date: new Date("2023-02-10")
  },
  {
    id: "EMP005",
    fullname: "Lisa Anderson",
    email: "lisa.anderson@ise.edu",
    role: "Teacher",
    contact_info: "+1-555-0105",
    created_date: new Date("2023-03-01")
  },
  {
    id: "EMP006",
    fullname: "Robert Taylor",
    email: "robert.taylor@ise.edu",
    role: "Manager",
    contact_info: "+1-555-0106",
    created_date: new Date("2023-01-01")
  },
  {
    id: "EMP007",
    fullname: "Jennifer Martinez",
    email: "jennifer.martinez@ise.edu",
    role: "Learning Advisor",
    contact_info: "+1-555-0107",
    created_date: new Date("2023-03-15")
  },
  {
    id: "EMP008",
    fullname: "Michael Brown",
    email: "michael.brown@ise.edu",
    role: "Teacher",
    contact_info: "+1-555-0108",
    created_date: new Date("2023-04-01")
  }
]; 