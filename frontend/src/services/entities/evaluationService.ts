import { ApiService } from '../base/apiService';
import { api } from '@/lib/apiClient';

export type AssessmentType =
  | 'Quiz 1'
  | 'Quiz 2'
  | 'Quiz 3'
  | 'Quiz 4'
  | 'Writing Project 1'
  | 'Writing Project 2'
  | 'Reading Assessment 1'
  | 'Reading Assessment 2';

export interface EvaluationKey {
  student_id: string;
  course_id: string;
  course_date: string; // YYYY-MM-DD
  assessment_type: AssessmentType;
}

export interface Evaluation extends EvaluationKey {
  teacher_id: string;
  grade: string;
  comment: string;
  enrolment_id: string;
  evaluation_date: string; // YYYY-MM-DD
}

export interface CreateEvaluationPayload extends Omit<Evaluation, 'teacher_id' | 'evaluation_date'> {}

class EvaluationService extends ApiService {
  private buildQuery(params?: Record<string, unknown>): string {
    if (!params) return '';
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      search.append(key, String(value));
    });
    const qs = search.toString();
    return qs ? `?${qs}` : '';
  }

  async getEvaluations(params?: Partial<EvaluationKey & { teacher_id: string }>): Promise<Evaluation[]> {
    const qs = this.buildQuery(params as any);
    // Flask route is registered at '/evaluation/' (with trailing slash)
    return this.get<Evaluation[]>(`/evaluation/${qs}`);
  }

  async createEvaluation(payload: CreateEvaluationPayload): Promise<Evaluation> {
    return this.post<Evaluation>('/evaluation/create', payload);
  }

  async updateEvaluation(keys: EvaluationKey, patch: Partial<Pick<Evaluation, 'grade' | 'comment'>>): Promise<{ message: string } | Evaluation> {
    const qs = this.buildQuery(keys as any);
    return this.put(`/evaluation/update${qs}`, patch);
  }

  // Class report: students info + their evaluations for a class/course/date
  async getClassStudentsWithEvaluations(
    classId: string,
    courseId: string,
    courseDate: string,
    term: string
  ): Promise<Array<{ student: { id: string; fullname: string; contact_info?: string; date_of_birth?: string }, evaluations: Evaluation[] }>> {
    const endpoint = `/evaluation/by-class?class_id=${encodeURIComponent(classId)}&course_id=${encodeURIComponent(courseId)}&course_date=${encodeURIComponent(courseDate)}&term=${encodeURIComponent(term)}`;
    const res = await this.get<any>(endpoint);
    // Backend wraps as { message, data }; tolerate both shapes
    return Array.isArray(res) ? res : (res?.data ?? []);
  }

  // Export a single student's evaluation report as a PDF (Blob)
  async exportEvaluationReport(studentId: string, courseId: string, teacherId: string): Promise<Blob> {
    const endpoint = `/evaluation/export?student_id=${encodeURIComponent(studentId)}&course_id=${encodeURIComponent(courseId)}&teacher_id=${encodeURIComponent(teacherId)}`;
    // Empty JSON body to satisfy backend's JSON check
    return api.post<Blob>(endpoint, {}, { responseType: 'blob' });
  }
}

export default new EvaluationService();


