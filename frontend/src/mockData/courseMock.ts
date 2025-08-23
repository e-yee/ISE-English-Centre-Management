export interface Course {
  id: string;
  name: string;
  duration: number;
  start_date: Date;
  schedule: string;
  learning_advisor_id: string;
  fee: number;
  prerequisites: string;
  created_date: Date;
  description?: string;
  end_date?: Date;
}

export const mockCourses: Course[] = [
  {
    id: "CRS001",
    name: "Introduction to React",
    duration: 3,
    start_date: new Date("2024-03-01"),
    schedule: "Mon, Wed, Fri 10:00-12:00",
    learning_advisor_id: "EMP001",
    fee: 299,
    prerequisites: "Basic JavaScript",
    created_date: new Date("2024-02-01"),
    description: "Learn the fundamentals of React development",
    end_date: new Date("2024-05-31")
  },
  {
    id: "CRS002",
    name: "Advanced JavaScript",
    duration: 2,
    start_date: new Date("2024-04-01"),
    schedule: "Tue, Thu 14:00-16:00",
    learning_advisor_id: "EMP001",
    fee: 249,
    prerequisites: "JavaScript Basics",
    created_date: new Date("2024-02-15"),
    description: "Deep dive into advanced JavaScript concepts",
    end_date: new Date("2024-05-31")
  },
  {
    id: "CRS003",
    name: "Full Stack Development",
    duration: 4,
    start_date: new Date("2024-05-01"),
    schedule: "Mon, Wed, Fri 14:00-16:00",
    learning_advisor_id: "EMP002",
    fee: 499,
    prerequisites: "React, Node.js Basics",
    created_date: new Date("2024-03-01"),
    description: "Complete full-stack development course",
    end_date: new Date("2024-08-31")
  },
  {
    id: "CRS004",
    name: "Python for Data Science",
    duration: 3,
    start_date: new Date("2024-04-15"),
    schedule: "Tue, Thu 10:00-12:00",
    learning_advisor_id: "EMP001",
    fee: 349,
    prerequisites: "Basic Programming",
    created_date: new Date("2024-02-20"),
    description: "Data science with Python and pandas",
    end_date: new Date("2024-07-15")
  },
  {
    id: "CRS005",
    name: "UI/UX Design Fundamentals",
    duration: 2,
    start_date: new Date("2024-03-20"),
    schedule: "Mon, Wed 16:00-18:00",
    learning_advisor_id: "EMP002",
    fee: 199,
    prerequisites: "None",
    created_date: new Date("2024-01-15"),
    description: "Learn modern UI/UX design principles",
    end_date: new Date("2024-05-20")
  },
  {
    id: "CRS006",
    name: "Node.js Backend Development",
    duration: 3,
    start_date: new Date("2024-06-01"),
    schedule: "Tue, Thu 18:00-20:00",
    learning_advisor_id: "EMP007",
    fee: 399,
    prerequisites: "JavaScript, Basic HTTP",
    created_date: new Date("2024-04-01"),
    description: "Build scalable backend applications",
    end_date: new Date("2024-08-31")
  },
  {
    id: "CRS007",
    name: "Mobile App Development",
    duration: 4,
    start_date: new Date("2024-07-01"),
    schedule: "Mon, Wed, Fri 09:00-11:00",
    learning_advisor_id: "EMP002",
    fee: 599,
    prerequisites: "React Native Basics",
    created_date: new Date("2024-05-01"),
    description: "Cross-platform mobile development",
    end_date: new Date("2024-10-31")
  },
  {
    id: "CRS008",
    name: "Database Design & SQL",
    duration: 2,
    start_date: new Date("2024-05-15"),
    schedule: "Sat 10:00-14:00",
    learning_advisor_id: "EMP007",
    fee: 299,
    prerequisites: "Basic Computer Skills",
    created_date: new Date("2024-03-15"),
    description: "Database design and SQL programming",
    end_date: new Date("2024-07-15")
  }
]; 