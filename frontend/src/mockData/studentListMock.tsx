// Mock data for student list based on Figma design and database schema
export interface StudentData {
  id: string;
  studentId: string;
  name: string;
  classId: string;
  index: number;
}

export const studentListMockData: StudentData[] = [
  {
    id: 'STD001',
    studentId: 'Std001',
    name: 'Rafael Nadal',
    classId: 'CL001',
    index: 1
  },
  {
    id: 'STD002',
    studentId: 'Std002',
    name: 'Lionel Messi',
    classId: 'CL001',
    index: 2
  },
  {
    id: 'STD003',
    studentId: 'Std003',
    name: 'Lewis Hamilton',
    classId: 'CL001',
    index: 3
  },
  {
    id: 'STD004',
    studentId: 'Std004',
    name: 'Tiger Woods',
    classId: 'CL001',
    index: 4
  },
  {
    id: 'STD005',
    studentId: 'Std005',
    name: 'Usain Bolt',
    classId: 'CL001',
    index: 5
  },
  {
    id: 'STD006',
    studentId: 'Std006',
    name: 'Serena Williams',
    classId: 'CL002',
    index: 1
  },
  {
    id: 'STD007',
    studentId: 'Std007',
    name: 'Michael Jordan',
    classId: 'CL002',
    index: 2
  },
  {
    id: 'STD008',
    studentId: 'Std008',
    name: 'Cristiano Ronaldo',
    classId: 'CL002',
    index: 3
  },
  {
    id: 'STD009',
    studentId: 'Std009',
    name: 'Tom Brady',
    classId: 'CL002',
    index: 4
  },
  {
    id: 'STD010',
    studentId: 'Std010',
    name: 'LeBron James',
    classId: 'CL002',
    index: 5
  },
  {
    id: 'STD011',
    studentId: 'Std011',
    name: 'Kobe Bryant',
    classId: 'CL003',
    index: 1
  },
  {
    id: 'STD012',
    studentId: 'Std012',
    name: 'Stephen Curry',
    classId: 'CL003',
    index: 2
  },
  {
    id: 'STD013',
    studentId: 'Std013',
    name: 'Kevin Durant',
    classId: 'CL003',
    index: 3
  },
  {
    id: 'STD014',
    studentId: 'Std014',
    name: 'Giannis Antetokounmpo',
    classId: 'CL003',
    index: 4
  },
  {
    id: 'STD015',
    studentId: 'Std015',
    name: 'Luka Dončić',
    classId: 'CL003',
    index: 5
  }
];

// Helper function to get students by class ID
export const getStudentsByClassId = (classId: string): StudentData[] => {
  return studentListMockData.filter(student => student.classId === classId);
};

// Helper function to get student count for a class
export const getStudentCountByClassId = (classId: string): number => {
  return getStudentsByClassId(classId).length;
};

// Helper function to get total capacity (mock data - assuming 50 max per class)
export const getClassCapacity = (): number => {
  return 50;
};

// Helper function to get formatted student count display (e.g., "10/50")
export const getFormattedStudentCount = (classId: string): string => {
  const currentCount = getStudentCountByClassId(classId);
  const maxCapacity = getClassCapacity();
  return `${currentCount}/${maxCapacity}`;
};
