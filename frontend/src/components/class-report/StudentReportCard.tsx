import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts';
import { useEvaluations } from '@/hooks/entities/useEvaluations';
import { ExportNotification } from '@/components/notifications/ExportNotification';

interface EvaluationRow {
  assessment_type: string;
  grade: string | number;
  comment?: string;
  evaluation_date?: string;
}

interface StudentReportCardProps {
  student: {
    index: number;
    name: string;
    studentId: string;
    assessment?: string;
  };
  evaluations?: EvaluationRow[];
  className?: string;
  courseId?: string; // needed for export
}

const StudentReportCard: React.FC<StudentReportCardProps> = ({ student, evaluations = [], className, courseId }) => {
  const { index, name, studentId } = student as any;
  const { user } = useAuth();
  const { exportReport, isExporting } = useEvaluations();
  const [showNotification, setShowNotification] = useState(false);

  const handleExport = async () => {
    try {
      if (!courseId || !studentId || !user?.id) return;
      const blob = await exportReport({ studentId, courseId, teacherId: user.id });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `evaluation_report_${studentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setShowNotification(true);
    } catch (e) {
      console.error('Export failed', e);
    }
  };

  const normalizeLetter = (val: string | number | undefined): string | null => {
    if (val === undefined || val === null) return null;
    const s = String(val).trim().toUpperCase();
    // If looks like a letter grade pattern return it
    if (/^(A\+|A|A-|B\+|B|B-|C\+|C|C-|D\+|D|D-|F)$/.test(s)) return s;
    const n = Number(s);
    if (n === null) return null;
    if (n >= 97) return 'A+';
    if (n >= 93) return 'A';
    if (n >= 90) return 'A-';
    if (n >= 87) return 'B+';
    if (n >= 83) return 'B';
    if (n >= 80) return 'B-';
    if (n >= 77) return 'C+';
    if (n >= 73) return 'C';
    if (n >= 70) return 'C-';
    if (n >= 67) return 'D+';
    if (n >= 63) return 'D';
    if (n >= 60) return 'D-';
    return 'F';
  };

  const getGradeClasses = (letter: string) => {
    const l = letter.toUpperCase();
    if (l.startsWith('A')) return 'bg-green-100 text-green-700 border border-green-200';
    if (l.startsWith('B')) return 'bg-blue-100 text-blue-700 border border-blue-200';
    if (l.startsWith('C')) return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    return 'bg-red-100 text-red-700 border border-red-200';
  };

  return (
    <>
      <ExportNotification isOpen={showNotification} onClose={() => setShowNotification(false)} />
      <Card className={cn(
        "bg-white border border-black/20 shadow-[5px_4px_4px_0px_rgba(0,0,0,0.25)] transition-all duration-300 ease-in-out",
        "w-full rounded-[15px] p-6",
        className
      )}>
        <CardContent className="p-0">
          {/* Student Information Section */}
          <div className="flex flex-col items-center mb-6">
            <div className="text-[30px] font-semibold text-black leading-[1.4em] font-comfortaa text-center">
              {index}. {name}
            </div>
            <div className="text-[24px] font-semibold text-black/50 leading-[1.4em] font-comfortaa text-center">
              ID: {studentId}
            </div>
          </div>

          {/* Export + Grid */}
          <div className="flex justify-end mb-3">
            <Button disabled={!courseId || isExporting} onClick={handleExport} className="bg-[#7C8FD5] hover:bg-indigo-600">
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
          </div>
          {/* Dynamic Assessment Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {evaluations.map((ev, i) => {
              const letter = normalizeLetter(ev.grade);
              return (
                <div key={`${ev.assessment_type}-${i}`} className="border border-black/20 rounded-[12px] p-4 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[18px] font-semibold text-black leading-[1.4em] font-comfortaa">
                      {ev.assessment_type}
                    </div>
                    <div className="flex items-center gap-2">
                      {letter && (
                        <span className={cn('px-3 py-1 text-[16px] rounded-full font-semibold', getGradeClasses(letter))}>
                          {letter}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-[14px] text-black/70 leading-snug">
                    {ev.comment && ev.comment.trim().length > 0 ? ev.comment : '(No comment)'}
                  </div>
                </div>
              );
            })}
            {evaluations.length === 0 && (
              <div className="text-[16px] text-gray-500">No evaluations</div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default StudentReportCard; 