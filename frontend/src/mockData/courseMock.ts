import type { Course } from '@/types/course';

export const mockCourses: Course[] = [
  {
    id: "COURSE-001",
    name: "Introduction to React",
    duration: 12,
    start_date: new Date("2024-03-15"),
    schedule: "Mon-Wed, 09:00-11:00",
    fee: 299,
    prerequisites: "Basic HTML/CSS knowledge",
    created_date: new Date("2024-02-01"),
    description: "Learn the fundamentals of React including components, state management, and hooks. Perfect for beginners who want to build modern web applications."
  },
  {
    id: "COURSE-002", 
    name: "Advanced JavaScript",
    duration: 8,
    start_date: new Date("2024-04-01"),
    schedule: "Tue-Thu, 14:00-16:00",
    fee: 249,
    prerequisites: "Basic JavaScript knowledge",
    created_date: new Date("2024-02-15"),
    description: "Master advanced JavaScript concepts including closures, prototypes, async programming, and modern ES6+ features."
  },
  {
    id: "COURSE-003",
    name: "Full Stack Development",
    duration: 16,
    start_date: new Date("2024-05-01"),
    schedule: "Mon-Fri, 10:00-12:00",
    fee: 499,
    prerequisites: "JavaScript and basic web development",
    created_date: new Date("2024-03-01"),
    description: "Comprehensive course covering frontend and backend development, databases, and deployment strategies for modern web applications."
  },
  {
    id: "COURSE-004",
    name: "Python for Data Science",
    duration: 10,
    start_date: new Date("2024-04-15"),
    schedule: "Wed-Fri, 13:00-15:00",
    fee: 349,
    prerequisites: "Basic programming concepts",
    created_date: new Date("2024-02-20"),
    description: "Learn Python programming with focus on data analysis, visualization, and machine learning fundamentals."
  },
  {
    id: "COURSE-005",
    name: "UI/UX Design Fundamentals",
    duration: 6,
    start_date: new Date("2024-03-20"),
    schedule: "Sat-Sun, 10:00-14:00",
    fee: 199,
    prerequisites: "No prerequisites required",
    created_date: new Date("2024-01-15"),
    description: "Learn the principles of user interface and user experience design, including wireframing, prototyping, and user research."
  }
]; 