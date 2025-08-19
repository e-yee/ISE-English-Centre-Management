import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import FeatureButtonList from '@/components/class/FeatureButtonList';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { User, ChevronDown, AlertCircle, CheckCircle } from 'lucide-react';
import StudentAttendanceCard from '@/components/attendance/StudentAttendanceCard';
import type { StudentData } from '@/mockData/studentListMock';
import { useParams } from 'react-router-dom';
import { useMarkAttendance } from '@/hooks/entities/useAttendance';
import { Badge } from '@/components/ui/badge';
import { useClassStudents } from '@/hooks/entities/useStudent';
import { useClasses } from '@/hooks/entities/useClasses';

interface AttendancePageProps {
  className?: string;
}

type AttendanceStatus = 'present' | 'absent' | 'unmarked';

const AttendancePage: React.FC<AttendancePageProps> = ({ className }) => {
  const { classId = '', courseId = '', courseDate = '', term = '' } =
    useParams<{ classId: string; courseId: string; courseDate: string; term: string }>();
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [selectedDate, setSelectedDate] = useState("Today");

  React.useEffect(() => {
    // Reset attendance state when class context changes
    setAttendance({});
  }, [classId, courseId, courseDate, term]);

  const { mutate: markAttendance, isPending: marking } = useMarkAttendance();
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Fetch students via SWR (stale-while-revalidate) using composite key
  const { data: students = [], isLoading: studentsLoading, error } = useClassStudents(
    classId,
    courseId,
    courseDate,
    String(term)
  );
  const { isLoading: classesLoading } = useClasses();
  if (!classId || !courseId || !courseDate || !term) {
    return <div className="flex items-center justify-center h-full">Missing class parameters</div>;
  }

  if (studentsLoading || classesLoading) {
    return <div className="flex items-center justify-center h-full">Loading students...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-full">Failed to load students</div>;
  }

  const dateOptions = ["Today", "Yesterday", "Custom Date"];

  const toggleAttendance = (studentId: string) => {
    setAttendance((prev) => {
      const current = prev[studentId] || "unmarked";
      let next: AttendanceStatus;

      if (current === "unmarked") {
        next = "present";
      } else if (current === "present") {
        next = "absent";
      } else {
        next = "present";
      }

      return { ...prev, [studentId]: next };
    });
  };

  // Map API students to UI card shape expected by StudentAttendanceCard
  const studentsForCard: StudentData[] = (students as any[]).map((s: any, idx: number) => ({
    id: s.id,
    studentId: s.id,
    name: s.fullname ?? s.name ?? String(s.id),
    classId: classId,
    index: idx + 1,
  }));

  const presentCount = Object.values(attendance).filter((status) => status === "present").length;
  const absentCount = Object.values(attendance).filter((status) => status === "absent").length;
  const totalStudents = studentsForCard.length;

  return (
    <div className={cn("h-full overflow-hidden flex flex-col", className)}>
      {/* Feature Button List - positioned between header and class info */}
      <div className={cn(
        "pt-4 pb-3 flex-shrink-0 transition-all duration-300 ease-in-out",
        "px-4"
      )}>
        <FeatureButtonList
          classId={classId}
          courseId={courseId}
          courseDate={courseDate}
          term={term}
        />
      </div>

      {/* Main Content */}
      <main className="p-6 flex-1 overflow-hidden flex flex-col">
        {/* Class Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold 
                           text-violet-600">
              Class {classId || ''}
            </h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-40 justify-between">
                  {selectedDate}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {dateOptions.map((date) => (
                  <DropdownMenuItem
                    key={date}
                    onClick={() => setSelectedDate(date)}
                  >
                    {date}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-row items-center gap-1 text-sm text-gray-600">
              <User className="h-6 w-6" />
              <span className="text-xl mt-1">{totalStudents}</span>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Button
                className="bg-teal-500 hover:bg-teal-700 cursor-pointer"
                disabled={marking || !classId || !courseId || !courseDate || !term}
                onClick={() => {
                  setSaveSuccess(null);
                  setSaveError(null);
                  markAttendance(
                    {
                      classId,
                      courseId,
                      courseDate,
                      term,
                      enrolmentId: '',
                      attendance,
                    },
                    {
                      onSuccess: (res) => {
                        setSaveSuccess(res?.message || 'Attendance updated successfully!');
                        setSaveError(null);
                        setTimeout(() => setSaveSuccess(null), 2000);
                      },
                      onError: (err: unknown) => {
                        let message = 'Failed to update attendance';
                        if (err instanceof Error) {
                          const m = err.message || '';
                          if (/network/i.test(m) || /failed to fetch/i.test(m) || /localhost/i.test(m)) {
                            message = 'Unable to reach server. Please check your connection and try again.';
                          } else {
                            message = m;
                          }
                        }
                        setSaveError(message);
                        setSaveSuccess(null);
                      },
                    }
                  );
                }}
              >
                {marking ? 'SAVING...' : 'SAVE CHANGES'}
              </Button>
              {saveError && (
                <Badge variant="destructive" className="gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {saveError}
                </Badge>
              )}
              {saveSuccess && (
                <Badge className="gap-1 bg-green-100 text-green-800 border-green-200">
                  <CheckCircle className="h-3 w-3" />
                  {saveSuccess}
                </Badge>
              )}
            </div>
          </div>
        </div>
        {/* Attendance Stats */}
        <div className="flex gap-4 mb-4">
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
            <div className="text-green-800 font-semibold">Present: {presentCount}</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2">
            <div className="text-red-800 font-semibold">Absent: {absentCount}</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
            <div className="text-gray-800 font-semibold">
              Unmarked: {totalStudents - presentCount - absentCount}
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="flex gap-3 mb-6 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">Quick Actions:</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-green-700 border-green-300 hover:bg-green-50 bg-transparent"
            onClick={() => {
              const allPresentAttendance = studentsForCard.reduce(
                (acc, student) => {
                  acc[student.id] = "present";
                  return acc;
                },
                {} as Record<string, AttendanceStatus>,
              );
              setAttendance(allPresentAttendance);
            }}
          >
            Mark All Present
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-700 border-red-300 hover:bg-red-50 bg-transparent"
            onClick={() => {
              const allAbsentAttendance = studentsForCard.reduce(
                (acc, student) => {
                  acc[student.id] = "absent";
                  return acc;
                },
                {} as Record<string, AttendanceStatus>,
              );
              setAttendance(allAbsentAttendance);
            }}
          >
            Mark All Absent
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-gray-700 border-gray-300 hover:bg-gray-50 bg-transparent"
            onClick={() => setAttendance({})}
          >
            Clear All
          </Button>
        </div>

        {/* Student Grid Container - Full width and height */}
        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 h-full overflow-y-auto">
            {studentsForCard.map((student) => {
              const status = attendance[student.id] || "unmarked";
              return (
                <StudentAttendanceCard
                  key={student.id}
                  student={student}
                  status={status}
                  onClick={() => toggleAttendance(student.id)}
                />
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AttendancePage; 