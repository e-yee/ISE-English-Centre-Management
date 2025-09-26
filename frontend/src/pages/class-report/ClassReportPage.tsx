import React, { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import FeatureButtonList from '@/components/class/FeatureButtonList';
import type { StudentReportData } from '@/mockData/classReportMock';
import { Card, CardContent } from '@/components/ui/card';
import AvatarIcon from '@/assets/class/user.svg';
import { ExportNotification } from '@/components/notifications/ExportNotification';
import { useParams } from 'react-router-dom';
import { useClassReport } from '@/hooks/entities/useEvaluations';
import StudentReportCard from '@/components/class-report/StudentReportCard';
import { Skeleton } from '@/components/ui/skeleton';

interface ClassReportPageProps {
  className?: string;
}

const ClassReportPage: React.FC<ClassReportPageProps> = ({ className }) => {
  const { classId = '', courseId = '', courseDate = '', term = '' } =
    useParams<{ classId: string; courseId: string; courseDate: string; term: string }>();

  const { data: reportData = [], loading } = useClassReport(
    classId,
    courseId,
    courseDate,
    term,
    !!classId && !!courseId && !!courseDate && !!term
  );

  const adaptGrade = (grade: string | number | null | undefined) => {
    if (grade === null || grade === undefined) return 0;
    const n = Number(grade);
    if (!Number.isNaN(n)) return Math.max(0, Math.min(100, n));
    const g = String(grade).trim().toUpperCase();
    if (g === 'A') return 95;
    if (g === 'B') return 85;
    if (g === 'C') return 75;
    if (g === 'D') return 65;
    if (g === 'F') return 55;
    return 0;
  };

  const pickLatestByType = (evals: any[], type: string) => {
    const filtered = evals.filter(e => e.assessment_type === type);
    filtered.sort((a, b) => {
      const da = a.evaluation_date ? Date.parse(a.evaluation_date) : -Infinity;
      const db = b.evaluation_date ? Date.parse(b.evaluation_date) : -Infinity;
      if (db !== da) return db - da;
      return adaptGrade(b.grade) - adaptGrade(a.grade);
    });
    return filtered[0];
  };

  const average = (nums: number[]) => {
    if (!nums.length) return 0;
    return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
  };

  const adaptedStudents = useMemo<StudentReportData[]>(() => {
    return reportData.map((row: any, idx: number) => {
      const evals: any[] = Array.isArray(row.evaluations) ? row.evaluations : [];

      const homeworkTypes = ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4'];
      const midtermTypes = ['Reading Assessment 1', 'Writing Project 1'];
      const finalTypes = ['Reading Assessment 2', 'Writing Project 2'];

      const pickAndGrade = (types: string[]) => {
        const grades = types
          .map(t => pickLatestByType(evals, t))
          .filter(Boolean)
          .map(e => adaptGrade(e.grade));
        return average(grades);
      };

      const scores = {
        homework: pickAndGrade(homeworkTypes),
        midterm: pickAndGrade(midtermTypes),
        final: pickAndGrade(finalTypes),
      };

      const latest = [...evals].sort((a, b) => {
        const da = a.evaluation_date ? Date.parse(a.evaluation_date) : -Infinity;
        const db = b.evaluation_date ? Date.parse(b.evaluation_date) : -Infinity;
        return db - da;
      })[0];

      return {
        id: row.student?.id ?? String(idx + 1),
        name: row.student?.fullname ?? row.student?.id ?? String(idx + 1),
        studentId: row.student?.id ?? String(idx + 1),
        index: idx + 1,
        scores,
        assessment: latest?.comment ?? '',
      } as StudentReportData;
    });
  }, [reportData]);

  const [students, setStudents] = useState<StudentReportData[]>([]);
  const [showNotification, setShowNotification] = useState(false);

  React.useEffect(() => {
    // On route change, clear previous student data to avoid showing stale reports
    setStudents([]);
  }, [classId, courseId, courseDate, term]);

  React.useEffect(() => {
    setStudents(adaptedStudents);
  }, [adaptedStudents]);

  // Read-only view for report page; no local mutators required

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  return (
    <div className={cn("h-full overflow-hidden flex flex-col", className)}>
      {/* Export Notification */}
      <ExportNotification 
        isOpen={showNotification} 
        onClose={handleCloseNotification} 
      />
      
      {/* Feature Button List - Beneath header like in Homescreen.tsx */}
      <div className={cn(
        "pt-3 pb-3 flex-shrink-0 transition-all duration-300 ease-in-out",
        "px-4"
      )}>
        <FeatureButtonList
          classId={classId}
          courseId={courseId}
          courseDate={courseDate}
          term={term}
        />
      </div>

      {/* Main Content Container */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* One Big Container - Report Header + Student Cards */}
          <Card className="bg-white border border-black/20 shadow-[5px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-[15px]">
            <CardContent className="p-6">
              {/* Report Header Section */}
              <div className="flex items-center justify-between mb-6">
                {/* Left Section - Report Badge and Class Name */}
                <div className="flex items-center gap-4">
                  {/* Report Badge - Changed to black */}
                  <div className="text-red-500 px-1 rounded-[15px] font-semibold text-[30px] font-comfortaa border-2 border-red-500">
                    Report
                  </div>

                  {/* Class Name - Reduced size */}
                  <div 
                    className="text-[40px] font-normal leading-[1.4em] font-comfortaa
                               text-violet-600"                    
                  >
                    Class {classId}
                  </div>
                </div>

                {/* Right Section - Student Count */}
                <div className="flex items-center gap-6">
                  {/* Student Count - Reduced size */}
                  <div className="relative">
                    <div
                      className="bg-white rounded-[10px] flex items-center justify-center gap-2 px-3 py-0 border-[2px] border-solid"
                      style={{
                        borderColor: '#4A42AE'
                      }}
                    >
                      <img
                        src={AvatarIcon}
                        alt="User"
                        className="w-5 h-5 object-contain"
                        style={{
                          filter: 'opacity(0.6)'
                        }}
                      />
                      <span
                        className="text-[24px] font-normal leading-[1.4em] font-comfortaa"
                        style={{
                          color: 'rgba(0, 0, 0, 0.6)'
                        }}
                      >
                        {students.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Student Report Cards - List Layout */}
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="h-8 w-64" />
                      <Skeleton className="h-6 w-40" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Skeleton className="h-28 w-full" />
                        <Skeleton className="h-28 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {students.map((student) => (
                    <StudentReportCard
                      key={student.id}
                      student={student}
                      courseId={courseId}
                      evaluations={(reportData.find((r: any) => r.student?.id === student.studentId)?.evaluations) || []}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClassReportPage; 