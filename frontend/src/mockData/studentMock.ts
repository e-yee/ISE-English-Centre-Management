export interface Student {
  id: string;
  fullname: string;
  contact_info: string;
  date_of_birth: Date;
  created_date: Date;
}

export const mockStudents: Student[] = [
  {
    id: "STU001",
    fullname: "John Smith",
    contact_info: "john.smith@email.com",
    date_of_birth: new Date("1995-03-15"),
    created_date: new Date("2024-01-15")
  },
  {
    id: "STU002",
    fullname: "Sarah Johnson",
    contact_info: "sarah.johnson@email.com",
    date_of_birth: new Date("1998-07-22"),
    created_date: new Date("2024-01-20")
  },
  {
    id: "STU003",
    fullname: "Michael Brown",
    contact_info: "michael.brown@email.com",
    date_of_birth: new Date("1993-11-08"),
    created_date: new Date("2024-02-01")
  },
  {
    id: "STU004",
    fullname: "Emily Davis",
    contact_info: "emily.davis@email.com",
    date_of_birth: new Date("1996-05-12"),
    created_date: new Date("2024-02-10")
  },
  {
    id: "STU005",
    fullname: "David Wilson",
    contact_info: "david.wilson@email.com",
    date_of_birth: new Date("1994-09-30"),
    created_date: new Date("2024-02-15")
  },
  {
    id: "STU006",
    fullname: "Lisa Anderson",
    contact_info: "lisa.anderson@email.com",
    date_of_birth: new Date("1997-12-03"),
    created_date: new Date("2024-03-01")
  },
  {
    id: "STU007",
    fullname: "Robert Taylor",
    contact_info: "robert.taylor@email.com",
    date_of_birth: new Date("1992-04-18"),
    created_date: new Date("2024-03-05")
  },
  {
    id: "STU008",
    fullname: "Jennifer Martinez",
    contact_info: "jennifer.martinez@email.com",
    date_of_birth: new Date("1999-01-25"),
    created_date: new Date("2024-03-10")
  }
]; 