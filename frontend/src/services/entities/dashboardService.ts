import { ApiService } from '@/services/base/apiService';
import type { DashboardOverview, RevenueByYear, StudentStats, TeacherDetail, TeacherTotal } from '@/types/dashboard';

class DashboardService extends ApiService {
  async fetchOverview(): Promise<DashboardOverview> {
    const res = await this.get<any>('/dashboard/statistics');
    return {
      totalEmployees: res.total_employees ?? 0,
      totalTeachers: res.total_teachers ?? 0,
      totalLearningAdvisors: res.total_learning_advisors ?? 0,
      totalStudents: res.total_students ?? 0,
      totalRevenue: res.total_revenue ?? 0,
    };
  }

  async fetchStudentStats(): Promise<StudentStats> {
    const res = await this.get<any>('/dashboard/statistics/students');
    return {
      ageBuckets: [
        { label: 'Elementary (<12)', value: res.elementary_students ?? 0 },
        { label: 'Middle (12–14)', value: res.middle_school_students ?? 0 },
        { label: 'High (15–17)', value: res.high_school_students ?? 0 },
        { label: 'Other (>=18)', value: res.other_students ?? 0 },
      ],
      subjectBuckets: [
        { label: 'Math', value: res.math_students ?? 0 },
        { label: 'English', value: res.english_students ?? 0 },
      ],
      totalStudents: res.total_students ?? 0,
    };
  }

  async fetchTeacherTotal(): Promise<TeacherTotal> {
    const res = await this.get<any>('/dashboard/statistics/teachers');
    return { totalTeachers: res.total_teachers ?? 0 };
  }

  async fetchTeacherDetail(teacherId: number): Promise<TeacherDetail> {
    const res = await this.get<any>(`/dashboard/statistics/teachers/details?teacher_id=${teacherId}`);
    return {
      leaveCounts: res.leave_counts ?? 0,
      lateCounts: res.late_counts ?? 0,
      onTimeCounts: res.on_time_counts ?? 0,
      totalCounts: res.total_counts ?? 0,
      latePercentage: res.late_percentage ?? 0,
      onTimePercentage: res.on_time_percentage ?? 0,
      totalMathHours: res.total_math_hours ?? 0,
      totalEnglishHours: res.total_english_hours ?? 0,
    };
  }

  async fetchRevenue(): Promise<RevenueByYear> {
    const res = await this.get<any>('/dashboard/statistics/revenue');
    return { revenueByYear: res.revenue_by_year ?? [] };
  }
}

export const dashboardService = new DashboardService();


