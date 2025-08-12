import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { StudentPicker } from '@/components/scoring/StudentPicker';
import EvaluationForm, { type AssessmentType } from '@/components/scoring/EvaluationForm';
import EvaluationList from '@/components/scoring/EvaluationList';
import { useClassStudents } from '@/hooks/entities/useStudent';
import { useEvaluations } from '@/hooks/entities/useEvaluations';
import FeatureButtonList from '@/components/class/FeatureButtonList';

interface ScoringPageProps {
  className?: string;
}

const ScoringPage: React.FC<ScoringPageProps> = ({ className }) => {
  const { classId, courseId: routeCourseId, courseDate: routeCourseDate, term: routeTerm } = useParams<{
    classId: string; courseId: string; courseDate: string; term: string;
  }>();

  if (!classId) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-2xl font-semibold text-gray-600 mb-2">Class ID Required</div>
          <div className="text-gray-500">Please provide a valid class ID.</div>
        </div>
      </div>
    );
  }

  // Prefer route params; fall back to query params for backward-compat
  const [search] = useSearchParams();
  const qpCourseId = routeCourseId || search.get('courseId') || '';
  const qpCourseDate = routeCourseDate || search.get('courseDate') || '';
  const qpTerm = routeTerm || search.get('term') || '';

  // Students in class (lazy by params presence)
  const { data: students = [] } = useClassStudents(
    classId,
    qpCourseId,
    qpCourseDate,
    qpTerm
  );

  const [selected, setSelected] = React.useState<{ id: string; name: string } | null>(null);
  React.useEffect(() => {
    // Do not pre-select automatically; wait for explicit click to avoid premature API calls
    if (selected && !students.find((s: any) => s.id === selected.id)) {
      setSelected(null);
    }
  }, [students]);

  // Evaluations for selected student (lazy)
  const { data: evals = [], create, update } = useEvaluations({
    student_id: selected?.id,
    course_id: qpCourseId,
    course_date: qpCourseDate,
    enabled: !!selected?.id && !!qpCourseId && !!qpCourseDate,
  });

  const handleSubmit = async (payload: {
    student_id: string;
    course_id: string;
    course_date: string;
    assessment_type: AssessmentType;
    grade: string;
    comment: string;
  }) => {
    try {
      await create(payload as any);
      // After create, sync form with saved values
      setPrefill({
        assessment_type: payload.assessment_type,
        course_date: payload.course_date,
        grade: payload.grade,
        comment: payload.comment,
      });
    } catch (e: any) {
      const msg = String(e?.message || '').toLowerCase();
      if (msg.includes('already') || msg.includes('exists') || msg.includes('409')) {
        const { student_id, course_id, course_date, assessment_type, ...rest } = payload;
        await update({ student_id, course_id, course_date, assessment_type }, rest);
        // After update, sync form with latest values
        setPrefill({
          assessment_type,
          course_date,
          grade: rest.grade ?? '',
          comment: rest.comment ?? '',
        });
      } else {
        throw e;
      }
    }
  };

  const [prefill, setPrefill] = React.useState<{
    assessment_type?: AssessmentType;
    course_date?: string;
    grade?: string;
    comment?: string;
  } | undefined>(undefined);

  return (
    <div className={"h-full overflow-hidden flex flex-col " + (className ?? "") }>
      {/* Feature Button List */}
      <div className="pt-3 pb-3 flex-shrink-0 px-4">
        <FeatureButtonList
          classId={classId}
          courseId={qpCourseId}
          courseDate={qpCourseDate}
          term={qpTerm}
        />
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-hidden px-4">
        <div className="grid grid-cols-12 gap-4 h-full">
          <div className="col-span-4 h-full">
            <StudentPicker
              classId={classId}
              items={students.map((s: any) => ({ id: s.id, name: s.fullname }))}
              selectedStudentId={selected?.id}
              onSelect={(s) => setSelected({ id: s.id, name: (s as any).name })}
              className="h-full"
            />
          </div>
          <div className="col-span-8 h-full flex flex-col gap-4 min-h-0">
            {selected ? (
              <>
                <EvaluationForm
                  studentName={selected?.name}
                  studentId={selected?.id}
                  courseId={qpCourseId}
                  onSubmit={handleSubmit}
                  disabledTypes={evals.map((e) => e.assessment_type as AssessmentType)}
                  prefill={{
                    ...prefill,
                    course_date: qpCourseDate || prefill?.course_date,
                  }}
                  className="flex-1"
                />
                <EvaluationList
                  items={evals as any}
                  className="flex-1"
                  onSelect={(row) => setPrefill(row)}
                />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">Select a student to view evaluations</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoringPage;