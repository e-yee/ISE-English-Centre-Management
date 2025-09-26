import { useMutation } from '@tanstack/react-query';
import attendanceService, { type AttendanceMark, type AttendanceStatus } from '@/services/entities/attendanceService';

type LocalStatus = 'present' | 'absent' | 'unmarked';

export interface UseMarkAttendanceParams {
  classId: string;
  courseId: string;
  courseDate: string; // ISO or YYYY-MM-DD
  term: string | number;
  enrolmentId?: string;
  attendance: Record<string, LocalStatus>; // studentId -> status
}

function toYyyyMmDd(dateStr: string) {
  // Accepts already formatted YYYY-MM-DD; otherwise try to format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toISOString().split('T')[0];
}

export function useMarkAttendance() {
  return useMutation({
    mutationFn: async (params: UseMarkAttendanceParams) => {
      const { classId, courseId, courseDate, term, enrolmentId, attendance } = params;
      const marks: AttendanceMark[] = Object.entries(attendance)
        .filter(([, status]) => status === 'present' || status === 'absent')
        .map(([student_id, status]) => ({
          student_id,
          status: status === 'present' ? 'Present' : 'Absent',
        }));

      return attendanceService.markAttendance({
        classId,
        courseId,
        courseDate: toYyyyMmDd(courseDate),
        term,
        enrolmentId,
        marks,
      });
    },
  });
}


