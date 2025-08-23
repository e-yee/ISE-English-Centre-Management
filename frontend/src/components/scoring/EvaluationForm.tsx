import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export type AssessmentType =
  | 'Quiz 1'
  | 'Quiz 2'
  | 'Quiz 3'
  | 'Quiz 4'
  | 'Writing Project 1'
  | 'Writing Project 2'
  | 'Reading Assessment 1'
  | 'Reading Assessment 2';

const ASSESSMENT_OPTIONS: AssessmentType[] = [
  'Quiz 1',
  'Quiz 2',
  'Quiz 3',
  'Quiz 4',
  'Writing Project 1',
  'Writing Project 2',
  'Reading Assessment 1',
  'Reading Assessment 2',
];

interface EvaluationFormProps {
  studentName?: string;
  studentId?: string;
  courseId?: string;
  onSubmit?: (payload: {
    student_id: string;
    course_id: string;
    course_date: string;
    assessment_type: AssessmentType;
    grade: string;
    comment: string;
    enrolment_id?: string;
  }) => void | Promise<void>;
  className?: string;
  disabledTypes?: AssessmentType[];
  prefill?: Partial<{
    assessment_type: AssessmentType;
    course_date: string;
    grade: string;
    comment: string;
  }>;
  successMessage?: string;
}

export const EvaluationForm: React.FC<EvaluationFormProps> = ({
  studentName,
  studentId,
  courseId,
  onSubmit,
  className,
  disabledTypes = [],
  prefill,
  successMessage,
}) => {
  const [assessmentType, setAssessmentType] = React.useState<AssessmentType | ''>('');
  const [courseDate, setCourseDate] = React.useState<string>(new Date().toISOString().slice(0, 10));
  const [grade, setGrade] = React.useState<string>('');
  const [comment, setComment] = React.useState<string>('');
  const [submitting, setSubmitting] = React.useState(false);

  // Apply prefill when provided (e.g., selecting from history)
  React.useEffect(() => {
    if (!prefill) return;
    if (prefill.assessment_type) setAssessmentType(prefill.assessment_type);
    if (prefill.course_date) setCourseDate(prefill.course_date);
    if (typeof prefill.grade === 'string') setGrade(prefill.grade);
    if (typeof prefill.comment === 'string') setComment(prefill.comment);
  }, [prefill]);

  const canSubmit = !!(studentId && courseId && assessmentType && courseDate && grade);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !studentId || !courseId || !assessmentType) return;
    try {
      setSubmitting(true);
      await onSubmit?.({
        student_id: studentId,
        course_id: courseId,
        course_date: courseDate,
        assessment_type: assessmentType,
        grade,
        comment,
      });
      // Minimal UX: keep data, or clear grade/comment; choose clear grade/comment for next input
      setGrade('');
      setComment('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className={cn('h-full w-full max-w-full overflow-hidden bg-white border border-indigo-500 border-2 shadow-md rounded-[15px]', className)}>
      <CardContent className="px-4 py-2 h-full">
        <form onSubmit={handleSubmit} className="">
          <div>
            <div className="text-lg font-semibold text-gray-900">{studentName || 'Select a student'}</div>
            <div className="text-xs text-gray-500">{studentId}</div>
          </div>

          <div className="flex flex-col mt-2">
            <div className="w-full flex flex-row justify-between mb-2">
              <div className="w-[48%]">
                <Label>Assessment type</Label>
                <Select value={assessmentType} onValueChange={(v) => setAssessmentType(v as AssessmentType)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select assessment" />
                  </SelectTrigger>
                  <SelectContent>
                    {ASSESSMENT_OPTIONS.map((opt) => {
                      const isDisabled = disabledTypes.includes(opt) && assessmentType !== opt;
                      return (
                        <SelectItem key={opt} value={opt} disabled={isDisabled} className={isDisabled ? 'opacity-50 cursor-not-allowed' : ''}>
                          {opt}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-[48%]">
                <Label>Grade</Label>
                <Input
                  placeholder="e.g., A, A+"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value.slice(0, 2))}
                />
              </div>    
            </div>   
            <div className="w-full">
              <div className="w-full">
                <Label>Comment</Label>
                <Textarea placeholder="Teacher Evaluation (Optional)" value={comment} onChange={(e) => setComment(e.target.value)} />
              </div>
            </div>                           
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            {successMessage && (
              <Badge variant="outline" className="mr-auto border-green-500 bg-green-50 text-green-700">
                {successMessage}
              </Badge>
            )}
            <Button type="button" variant="outline" onClick={() => { setGrade(''); setComment(''); }}>Reset</Button>
            <Button className="bg-green-400" type="submit" disabled={!canSubmit || submitting}>Save</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EvaluationForm;


