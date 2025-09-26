import { useState } from 'react';
import studentAttendanceService from '@/services/entities/studentAttendanceService';
import { useQueryClient } from '@tanstack/react-query';

interface ContextKey {
	classId: string;
	courseId: string;
	courseDate: string; // YYYY-MM-DD
	term: string | number;
}

export function useAddStudentToClass(ctx: ContextKey) {
	const queryClient = useQueryClient();
	const [adding, setAdding] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const add = async (studentId: string) => {
		setAdding(true);
		setError(null);
		try {
			const res = await studentAttendanceService.addToClass({ ...ctx, studentId });
			await queryClient.invalidateQueries({ queryKey: ['students', 'class', ctx.classId, ctx.courseId, ctx.courseDate, ctx.term] });
			return res;
		} catch (e: any) {
			setError(e?.message || 'Failed to add student to class');
			throw e;
		} finally {
			setAdding(false);
		}
	};

	return { add, adding, error } as const;
}

export function useRemoveStudentFromClass(ctx: ContextKey) {
	const queryClient = useQueryClient();
	const [removing, setRemoving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const remove = async (studentId: string) => {
		setRemoving(true);
		setError(null);
		try {
			const res = await studentAttendanceService.removeFromClass({ ...ctx, studentId });
			await queryClient.invalidateQueries({ queryKey: ['students', 'class', ctx.classId, ctx.courseId, ctx.courseDate, ctx.term] });
			return res;
		} catch (e: any) {
			setError(e?.message || 'Failed to remove student from class');
			throw e;
		} finally {
			setRemoving(false);
		}
	};

	return { remove, removing, error } as const;
}


