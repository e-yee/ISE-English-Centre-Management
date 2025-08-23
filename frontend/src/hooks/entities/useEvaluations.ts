import { useMemo } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useDataFetching } from '../base/useDataFetching';
import evaluationService, { type Evaluation, type EvaluationKey, type CreateEvaluationPayload } from '@/services/entities/evaluationService';

interface UseEvaluationsArgs extends Partial<EvaluationKey> {
  enabled?: boolean;
}

export function useEvaluations(args: UseEvaluationsArgs = {}) {
  const { student_id, course_id, course_date, assessment_type, enabled = true } = args;
  const queryClient = useQueryClient();

  const params = useMemo(() => ({ student_id, course_id, course_date, assessment_type }), [student_id, course_id, course_date, assessment_type]);
  const queryKey = useMemo(() => ['evaluations', params], [params]);

  const { data, isLoading, error, refetch } = useDataFetching<Evaluation[]>(
    queryKey,
    async () => {
      try {
        const res = await evaluationService.getEvaluations(params);
        return Array.isArray(res) ? res : (res as any)?.data ?? [];
      } catch (e: any) {
        const msg = String(e?.message || '').toLowerCase();
        // Tolerate common backend responses as empty list for GET
        if (
          msg.includes('not found') ||
          msg.includes('request must be json') ||
          msg.includes('invalid input')
        ) {
          return [] as Evaluation[];
        }
        throw e;
      }
    },
    { enabled, staleTime: 5 * 60 * 1000 }
  );

  const invalidate = () => {
    // Invalidate both the evaluations for the specific student and the class-wide report
    queryClient.invalidateQueries({ queryKey: ['evaluations'] });
    queryClient.invalidateQueries({ queryKey: ['class-report'] });
  };

  const create = async (payload: CreateEvaluationPayload) => {
    const res = await evaluationService.createEvaluation(payload);
    await invalidate();
    return res;
  };

  const update = async (keys: EvaluationKey, patch: Partial<Pick<Evaluation, 'grade' | 'comment'>>) => {
    const res = await evaluationService.updateEvaluation(keys, patch);
    await invalidate();
    return res;
  };

  const { mutateAsync: exportReport, isPending: isExporting } = useMutation({
    mutationFn: ({ studentId, courseId, teacherId }: { studentId: string, courseId: string, teacherId: string }) =>
      evaluationService.exportEvaluationReport(studentId, courseId, teacherId),
  });

  return { data: data ?? [], loading: isLoading, error, refetch, create, update, exportReport, isExporting } as const;
}

// Class report: fetch students with their evaluations for a class/course/date
export function useClassReport(
  classId: string,
  courseId: string,
  courseDate: string,
  term: string,
  enabled: boolean = true
) {
  const params = { classId, courseId, courseDate, term };
  const queryKey = ['class-report', params];
  const { data, isLoading, error, refetch } = useDataFetching(
    queryKey,
    async () => evaluationService.getClassStudentsWithEvaluations(classId, courseId, courseDate, term),
    { enabled: enabled && !!classId && !!courseId && !!courseDate && !!term }
  );
  return { data: data ?? [], loading: isLoading, error, refetch } as const;
}


