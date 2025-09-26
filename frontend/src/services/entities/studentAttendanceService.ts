import { ApiService } from '../base/apiService';

export type StudentAttendance = {
	student_id: string;
	class_id: string;
	course_id: string;
	course_date: string; // YYYY-MM-DD
	term: number;
	enrolment_id: string;
};

interface AddToClassArgs {
	classId: string;
	courseId: string;
	courseDate: string; // YYYY-MM-DD
	term: string | number;
	studentId: string;
}

interface RemoveFromClassArgs extends Omit<AddToClassArgs, 'studentId'> {
	studentId: string;
}

class StudentAttendanceService extends ApiService {
	async addToClass(args: AddToClassArgs): Promise<StudentAttendance> {
		const { classId, courseId, courseDate, term, studentId } = args;
		const qs = `class_id=${encodeURIComponent(classId)}&course_id=${encodeURIComponent(courseId)}&course_date=${encodeURIComponent(courseDate)}&term=${encodeURIComponent(String(term))}`;
		return this.post<StudentAttendance>(`/student_attendance/learningadvisor/add?${qs}`, { student_id: studentId });
	}

	async removeFromClass(args: RemoveFromClassArgs): Promise<{ message: string }> {
		const { classId, courseId, courseDate, term, studentId } = args;
		const qs = `student_id=${encodeURIComponent(studentId)}&class_id=${encodeURIComponent(classId)}&course_id=${encodeURIComponent(courseId)}&course_date=${encodeURIComponent(courseDate)}&term=${encodeURIComponent(String(term))}`;
		return this.delete<{ message: string }>(`/student_attendance/learningadvisor/delete?${qs}`);
	}
}

export default new StudentAttendanceService();


