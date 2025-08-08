export type DashboardOverview = {
  totalEmployees: number;
  totalTeachers: number;
  totalLearningAdvisors: number;
  totalStudents: number;
  totalRevenue: number;
};

export type StudentStats = {
  ageBuckets: { label: string; value: number }[];
  subjectBuckets: { label: string; value: number }[];
  totalStudents: number;
};

export type TeacherTotal = {
  totalTeachers: number;
};

export type TeacherDetail = {
  leaveCounts: number;
  lateCounts: number;
  onTimeCounts: number;
  totalCounts: number;
  latePercentage: number;
  onTimePercentage: number;
  totalMathHours: number;
  totalEnglishHours: number;
};

export type RevenueByYear = {
  revenueByYear: number[];
};


