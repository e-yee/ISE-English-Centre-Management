import React from 'react';
import { StudentPicker } from '@/components/scoring/StudentPicker';
import EvaluationForm, { type AssessmentType } from '@/components/scoring/EvaluationForm';
import EvaluationList from '@/components/scoring/EvaluationList';
import { getClassData, type Student } from '@/mockData/scoringMock';
import DemoLayout from '@/components/demo/DemoLayout';

interface ScoringDemoPageProps {
  className?: string;
}

const ScoringDemoPage: React.FC<ScoringDemoPageProps> = ({ className }) => {
  // Use existing mock classId from scoringMock.ts
  const demoClassId = '1';
  const classData = getClassData(demoClassId);

  const [selected, setSelected] = React.useState<Student | null>(
    () => classData?.students?.[0] ?? null
  );
  const [evaluations, setEvaluations] = React.useState<
    { student_id: string; assessment_type: AssessmentType; course_date: string; grade: string; comment: string }[]
  >([]);
  const studentEvaluations = React.useMemo(
    () => (selected ? evaluations.filter((e) => e.student_id === selected.id) : []),
    [evaluations, selected]
  );

  const handleSubmit = async (payload: {
    student_id: string;
    course_id: string;
    course_date: string;
    assessment_type: AssessmentType;
    grade: string;
    comment: string;
  }) => {
    // Demo mode: store per student, upsert by composite key
    setEvaluations((prev) => {
      const idx = prev.findIndex(
        (e) =>
          e.student_id === payload.student_id &&
          e.assessment_type === payload.assessment_type &&
          e.course_date === payload.course_date
      );
      const row = { ...payload };
      const next = [...prev];
      if (idx >= 0) next[idx] = row as any;
      else next.unshift(row as any);
      return next;
    });
  };

  // Prefill selection state for click-to-edit
  const [prefill, setPrefill] = React.useState<{
    assessment_type?: AssessmentType;
    course_date?: string;
    grade?: string;
    comment?: string;
  } | undefined>(undefined);

  return (
    <DemoLayout>
      <div className={"h-full overflow-hidden flex flex-col " + (className ?? "") }>
        {/* Top controls spacer to mirror FeatureButtonList area in teacher pages */}
        <div className="pt-3 pb-3 flex-shrink-0 px-4" />

        {/* Content area */}
        <div className="flex-1 overflow-hidden px-4">
          <div className="grid grid-cols-12 gap-4 h-full">
            <div className="col-span-4 h-full">
              <StudentPicker
                classId={demoClassId}
                selectedStudentId={selected?.id}
                onSelect={(s) => setSelected(s)}
                className="h-full"
              />
            </div>
            <div className="col-span-8 h-full flex flex-col gap-4 min-h-0">
              <EvaluationForm
                studentName={selected?.name}
                studentId={selected?.id}
                courseId={classData?.id}
                onSubmit={handleSubmit}
                disabledTypes={studentEvaluations.map((e) => e.assessment_type)}
                prefill={prefill}
                className="flex-1"
              />
              <EvaluationList
                items={studentEvaluations}
                className="flex-1"
                onSelect={(row) => setPrefill(row)}
              />
            </div>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
};

export default ScoringDemoPage;


