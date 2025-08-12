import { ApiService } from '../base/apiService';

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
}

export default new EvaluationService();


