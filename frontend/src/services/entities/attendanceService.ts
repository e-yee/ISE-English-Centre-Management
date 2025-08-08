import { ApiService } from '../base/apiService';

export type AttendanceStatus = 'Present' | 'Absent';

export interface AttendanceMark {
  student_id: string;
  status: AttendanceStatus;
}

export interface ViewAttendanceParams {
  classId: string;
  courseId: string;
  courseDate: string; // YYYY-MM-DD
  term: string | number;
}

export interface MarkAttendanceParams extends ViewAttendanceParams {
  enrolmentId?: string; // schema requires it, backend ignores it
  marks: AttendanceMark[];
}

class AttendanceService extends ApiService {
  async viewAttendance(params: ViewAttendanceParams) {
    const { classId, courseId, courseDate, term } = params;
    const query = `class_id=${encodeURIComponent(classId)}&course_id=${encodeURIComponent(courseId)}&course_date=${encodeURIComponent(courseDate)}&term=${encodeURIComponent(String(term))}`;
    return this.get<any>(`/attendance/view?${query}`);
  }

  async markAttendance(params: MarkAttendanceParams): Promise<{ message: string }> {
    const { classId, courseId, courseDate, term, enrolmentId = '', marks } = params;
    const query = `class_id=${encodeURIComponent(classId)}&course_id=${encodeURIComponent(courseId)}&course_date=${encodeURIComponent(courseDate)}&term=${encodeURIComponent(String(term))}`;
    const body = {
      class_id: classId,
      course_id: courseId,
      course_date: courseDate,
      term: typeof term === 'number' ? term : parseInt(term, 10),
      enrolment_id: enrolmentId,
      marks,
    };
    const res = await this.patch<{ message: string }>(`/attendance/mark?${query}`, body);
    const message = res?.message || 'Attendance updated successfully.';
    return { message };
  }
}

export default new AttendanceService();


