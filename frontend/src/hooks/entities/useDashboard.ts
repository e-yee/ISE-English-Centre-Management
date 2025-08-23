import { useDataFetching } from '@/hooks/base/useDataFetching';
import { dashboardService } from '@/services/entities/dashboardService';
import type { DashboardOverview, RevenueByYear, StudentStats, TeacherDetail, TeacherTotal } from '@/types/dashboard';

export function useDashboardOverview() {
  return useDataFetching<DashboardOverview>(['dashboard','overview'], () => dashboardService.fetchOverview());
}

export function useDashboardStudentStats() {
  return useDataFetching<StudentStats>(['dashboard','students','stats'], () => dashboardService.fetchStudentStats());
}

export function useDashboardTeacherTotal() {
  return useDataFetching<TeacherTotal>(['dashboard','teachers','total'], () => dashboardService.fetchTeacherTotal());
}

export function useDashboardTeacherDetail(teacherId: number, enabled = true) {
  return useDataFetching<TeacherDetail>(
    ['dashboard','teachers','detail', String(teacherId ?? '')],
    () => dashboardService.fetchTeacherDetail(teacherId),
    { enabled: !!teacherId && enabled }
  );
}

export function useDashboardRevenue() {
  return useDataFetching<RevenueByYear>(['dashboard','revenue'], () => dashboardService.fetchRevenue());
}


