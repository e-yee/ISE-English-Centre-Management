import type { Issue, Teacher, Student, Room } from '@/types/issue';

export const mockIssues: Issue[] = [
  {
    id: "ISS001",
    teacher_id: "EMP001",
    issue_type: "Student Behavior",
    issue_description: "Student disrupting class repeatedly during lecture, talking loudly and distracting other students",
    status: "Open",
    reported_date: "2025-01-23",
    student_id: "STD001",
    room_id: null
  },
  {
    id: "ISS002",
    teacher_id: "EMP002",
    issue_type: "Technical",
    issue_description: "Projector not working properly, display is flickering and showing distorted colors",
    status: "Open",
    reported_date: "2025-01-23",
    student_id: null,
    room_id: "ROOM101"
  },
  {
    id: "ISS003",
    teacher_id: "EMP001",
    issue_type: "Student Behavior",
    issue_description: "Student arrived 30 minutes late and disturbed the ongoing class discussion",
    status: "Done",
    reported_date: "2025-01-22",
    student_id: "STD002",
    room_id: null
  },
  {
    id: "ISS004",
    teacher_id: "EMP003",
    issue_type: "Technical",
    issue_description: "Air conditioning system not working properly, room temperature too high for comfortable learning",
    status: "Done",
    reported_date: "2025-01-21",
    student_id: null,
    room_id: "ROOM102"
  },
  {
    id: "ISS005",
    teacher_id: "EMP002",
    issue_type: "Student Behavior",
    issue_description: "Student using mobile phone during class and refusing to put it away when asked",
    status: "Open",
    reported_date: "2025-01-22",
    student_id: "STD003",
    room_id: null
  },
  {
    id: "ISS006",
    teacher_id: "EMP004",
    issue_type: "Technical",
    issue_description: "WiFi connection unstable, affecting online teaching materials and student access",
    status: "Open",
    reported_date: "2025-01-20",
    student_id: null,
    room_id: "ROOM103"
  },
  {
    id: "ISS007",
    teacher_id: "EMP001",
    issue_type: "Student Behavior",
    issue_description: "Student showing disrespectful behavior towards classmates during group activities",
    status: "Done",
    reported_date: "2025-01-19",
    student_id: "STD004",
    room_id: null
  },
  {
    id: "ISS008",
    teacher_id: "EMP003",
    issue_type: "Technical",
    issue_description: "Whiteboard markers not working, unable to write clearly on the board",
    status: "Done",
    reported_date: "2025-01-18",
    student_id: null,
    room_id: "ROOM104"
  }
];

// Mock data for resolving IDs to names
export const mockTeachers: Teacher[] = [
  { id: "EMP001", name: "John Smith" },
  { id: "EMP002", name: "Sarah Johnson" },
  { id: "EMP003", name: "Mike Wilson" },
  { id: "EMP004", name: "Emily Davis" },
  { id: "EMP005", name: "David Brown" }
];

export const mockStudents: Student[] = [
  { id: "STD001", name: "Alice Brown" },
  { id: "STD002", name: "Bob Davis" },
  { id: "STD003", name: "Charlie Wilson" },
  { id: "STD004", name: "Diana Martinez" },
  { id: "STD005", name: "Ethan Johnson" }
];

export const mockRooms: Room[] = [
  { id: "ROOM101", name: "Classroom A1" },
  { id: "ROOM102", name: "Classroom B2" },
  { id: "ROOM103", name: "Classroom C3" },
  { id: "ROOM104", name: "Computer Lab 1" },
  { id: "ROOM105", name: "Language Lab" }
];

// Helper functions to resolve IDs to names
export const getTeacherNameById = (teacherId: string): string => {
  const teacher = mockTeachers.find(t => t.id === teacherId);
  return teacher ? teacher.name : `Teacher-${teacherId}`;
};

export const getStudentNameById = (studentId: string | null): string => {
  if (!studentId) return '';
  const student = mockStudents.find(s => s.id === studentId);
  return student ? student.name : `Student-${studentId}`;
};

export const getRoomNameById = (roomId: string | null): string => {
  if (!roomId) return '';
  const room = mockRooms.find(r => r.id === roomId);
  return room ? room.name : `Room-${roomId}`;
};