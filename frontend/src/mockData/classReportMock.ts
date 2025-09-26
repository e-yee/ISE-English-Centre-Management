/**
 * Mock data for Class Report page UI testing
 * Based on Figma design and realistic scenarios
 */

/**
 * Student score data structure
 */
export interface StudentScores {
  homework: number;
  midterm: number;
  final: number;
}

/**
 * Individual student report data
 */
export interface StudentReportData {
  /** Unique identifier for the student */
  id: string;
  /** Student's full name */
  name: string;
  /** Student ID (e.g., "STD001") */
  studentId: string;
  /** Student's position in class list */
  index: number;
  /** Student's scores for different assessments */
  scores: StudentScores;
  /** Teacher's assessment/comment for the student */
  assessment: string;
}

/**
 * Class report data structure
 */
export interface ClassReportData {
  /** Class name (e.g., "Class 1A") */
  className: string;
  /** Total number of students in the class */
  studentCount: number;
  /** Array of student report data */
  students: StudentReportData[];
}

/**
 * Props for StudentReportCard component
 */
export interface StudentReportCardProps {
  /** Student data to display */
  student: StudentReportData;
  /** Callback when score changes */
  onScoreChange: (type: keyof StudentScores, value: number) => void;
  /** Callback when assessment changes */
  onAssessmentChange: (value: string) => void;
  /** Optional CSS class name */
  className?: string;
}

/**
 * Props for ReportHeader component
 */
export interface ReportHeaderProps {
  /** Class name to display */
  className?: string;
  /** Class name to display */
  classDisplayName: string;
  /** Total number of students */
  studentCount: number;
  /** Callback for export button click */
  onExport: () => void;
}

/**
 * Props for ReportFeatureBar component
 */
export interface ReportFeatureBarProps {
  /** Currently active feature */
  activeFeature: string;
  /** Callback when feature changes */
  onFeatureChange: (feature: string) => void;
  /** Optional CSS class name */
  className?: string;
}

/**
 * Available feature buttons in the report page
 */
export type ReportFeature = 'information' | 'scoring' | 'daily-attendance' | 'materials' | 'report';

/**
 * Feature button configuration
 */
export interface FeatureButton {
  id: ReportFeature;
  label: string;
  icon?: string;
}

/**
 * Mock student data for UI testing
 * Covers various scenarios: perfect scores, failing grades, missing scores
 */
export const mockStudents: StudentReportData[] = [
  {
    id: "1",
    name: "Max Verstappen",
    studentId: "STD001",
    index: 1,
    scores: {
      homework: 85,
      midterm: 90,
      final: 88
    },
    assessment: "Excellent performance in class. Shows strong understanding of advanced concepts and demonstrates excellent problem-solving skills. Consistently participates in discussions and helps other students."
  },
  {
    id: "2",
    name: "Lewis Hamilton",
    studentId: "STD002",
    index: 2,
    scores: {
      homework: 92,
      midterm: 95,
      final: 94
    },
    assessment: "Outstanding student with perfect attendance. Demonstrates exceptional analytical thinking and consistently produces high-quality work. Natural leader in group activities."
  },
  {
    id: "3",
    name: "Charles Leclerc",
    studentId: "STD003",
    index: 3,
    scores: {
      homework: 78,
      midterm: 82,
      final: 80
    },
    assessment: "Good progress throughout the semester. Shows improvement in understanding complex topics. Needs more practice with advanced exercises but shows potential."
  },
  {
    id: "4",
    name: "Lando Norris",
    studentId: "STD004",
    index: 4,
    scores: {
      homework: 65,
      midterm: 70,
      final: 68
    },
    assessment: "Struggles with some advanced concepts but shows determination to improve. Would benefit from additional tutoring sessions. Good attendance and participation."
  },
  {
    id: "5",
    name: "Carlos Sainz",
    studentId: "STD005",
    index: 5,
    scores: {
      homework: 88,
      midterm: 85,
      final: 87
    },
    assessment: "Consistent performer with strong fundamentals. Good team player and contributes well to group discussions. Shows good understanding of course material."
  },
  {
    id: "6",
    name: "George Russell",
    studentId: "STD006",
    index: 6,
    scores: {
      homework: 75,
      midterm: 78,
      final: 76
    },
    assessment: "Average performance with room for improvement. Sometimes struggles with time management but shows good effort. Would benefit from more practice."
  },
  {
    id: "7",
    name: "Fernando Alonso",
    studentId: "STD007",
    index: 7,
    scores: {
      homework: 95,
      midterm: 98,
      final: 96
    },
    assessment: "Exceptional student with outstanding performance. Demonstrates deep understanding of all concepts. Excellent problem-solving skills and helps other students."
  },
  {
    id: "8",
    name: "Oscar Piastri",
    studentId: "STD008",
    index: 8,
    scores: {
      homework: 82,
      midterm: 85,
      final: 84
    },
    assessment: "Good student with consistent performance. Shows improvement over the semester. Participates well in class discussions and group activities."
  },
  {
    id: "9",
    name: "Esteban Ocon",
    studentId: "STD009",
    index: 9,
    scores: {
      homework: 70,
      midterm: 72,
      final: 71
    },
    assessment: "Shows effort but needs more practice with advanced topics. Good attendance and participation. Would benefit from additional study time."
  },
  {
    id: "10",
    name: "Pierre Gasly",
    studentId: "STD010",
    index: 10,
    scores: {
      homework: 87,
      midterm: 89,
      final: 88
    },
    assessment: "Strong performance throughout the semester. Good understanding of course material and demonstrates excellent analytical skills."
  },
  {
    id: "11",
    name: "Yuki Tsunoda",
    studentId: "STD011",
    index: 11,
    scores: {
      homework: 73,
      midterm: 76,
      final: 75
    },
    assessment: "Shows improvement over the semester. Sometimes struggles with complex topics but demonstrates good effort. Good attendance record."
  },
  {
    id: "12",
    name: "Valtteri Bottas",
    studentId: "STD012",
    index: 12,
    scores: {
      homework: 90,
      midterm: 88,
      final: 89
    },
    assessment: "Consistent high performer with excellent understanding of course material. Good team player and contributes well to discussions."
  },
  {
    id: "13",
    name: "Zhou Guanyu",
    studentId: "STD013",
    index: 13,
    scores: {
      homework: 68,
      midterm: 71,
      final: 70
    },
    assessment: "Shows potential but needs more practice with advanced concepts. Good attendance and participation. Would benefit from additional support."
  },
  {
    id: "14",
    name: "Alexander Albon",
    studentId: "STD014",
    index: 14,
    scores: {
      homework: 84,
      midterm: 86,
      final: 85
    },
    assessment: "Good performance with strong fundamentals. Demonstrates good understanding of course material and participates well in class."
  },
  {
    id: "15",
    name: "Logan Sargeant",
    studentId: "STD015",
    index: 15,
    scores: {
      homework: 62,
      midterm: 65,
      final: 64
    },
    assessment: "Struggles with some concepts but shows determination to improve. Would benefit from additional tutoring and more practice time."
  },
  {
    id: "16",
    name: "Nico Hulkenberg",
    studentId: "STD016",
    index: 16,
    scores: {
      homework: 79,
      midterm: 81,
      final: 80
    },
    assessment: "Average to good performance. Shows understanding of basic concepts but needs more practice with advanced topics."
  },
  {
    id: "17",
    name: "Kevin Magnussen",
    studentId: "STD017",
    index: 17,
    scores: {
      homework: 76,
      midterm: 78,
      final: 77
    },
    assessment: "Consistent performer with room for improvement. Good attendance and participation. Shows good effort throughout the semester."
  },
  {
    id: "18",
    name: "Daniel Ricciardo",
    studentId: "STD018",
    index: 18,
    scores: {
      homework: 83,
      midterm: 85,
      final: 84
    },
    assessment: "Good student with strong performance. Demonstrates good understanding of course material and participates well in discussions."
  },
  {
    id: "19",
    name: "Lance Stroll",
    studentId: "STD019",
    index: 19,
    scores: {
      homework: 71,
      midterm: 74,
      final: 73
    },
    assessment: "Shows improvement over the semester. Sometimes struggles with complex topics but demonstrates good effort and attendance."
  },
  {
    id: "20",
    name: "Sebastian Vettel",
    studentId: "STD020",
    index: 20,
    scores: {
      homework: 89,
      midterm: 91,
      final: 90
    },
    assessment: "Excellent student with outstanding performance. Demonstrates deep understanding of all concepts and helps other students."
  }
];

/**
 * Mock class report data for UI testing
 */
export const classReportMockData: ClassReportData = {
  className: "Class 1A",
  studentCount: 20,
  students: mockStudents
};

/**
 * Feature buttons configuration for ReportFeatureBar
 */
export const reportFeatureButtons = [
  {
    id: 'information' as const,
    label: 'Information',
    icon: '/assets/feature_bar/information.svg'
  },
  {
    id: 'scoring' as const,
    label: 'Scoring',
    icon: '/assets/feature_bar/scoring.svg'
  },
  {
    id: 'daily-attendance' as const,
    label: 'Daily Attendance',
    icon: '/assets/feature_bar/attendance_check.svg'
  },
  {
    id: 'materials' as const,
    label: 'Materials',
    icon: '/assets/feature_bar/copy.svg'
  },
  {
    id: 'report' as const,
    label: 'Report',
    icon: '/assets/feature_bar/export.svg'
  }
]; 