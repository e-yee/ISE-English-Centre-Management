import { useCallback, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';
import { useAddStudentToClass } from '@/hooks/entities/useStudentAttendance';

const formSchema = z.object({
	student_id: z.string().min(1),
});

type FormData = z.infer<typeof formSchema>;

interface AddStudentToClassFormProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	classId: string;
	courseId: string;
	courseDate: string; // YYYY-MM-DD
	term: string | number;
	onSuccess?: () => void;
}

export default function AddStudentToClassForm({ open, onOpenChange, classId, courseId, courseDate, term, onSuccess }: AddStudentToClassFormProps) {
	const [submitting, setSubmitting] = useState(false);
	const [successMsg, setSuccessMsg] = useState<string | null>(null);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	const { add } = useAddStudentToClass({ classId, courseId, courseDate, term });

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema) as any,
		defaultValues: { student_id: '' },
	});

	const onSubmit: SubmitHandler<FormData> = useCallback(async (data) => {
		setSubmitting(true);
		setSuccessMsg(null);
		setErrorMsg(null);
		try {
			await add(data.student_id);
			setSuccessMsg('Student added to class successfully');
			onSuccess?.();
			setTimeout(() => {
				setSuccessMsg(null);
				onOpenChange(false);
				form.reset({ student_id: '' });
			}, 1500);
		} catch (e: any) {
			setErrorMsg(e?.message || 'Failed to add student to class');
		} finally {
			setSubmitting(false);
		}
	}, [add, form, onOpenChange, onSuccess]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Add Student to Class</DialogTitle>
				</DialogHeader>

				{successMsg && (
					<Alert className="mb-3 border-green-300 bg-green-50 text-green-800 dark:border-green-700 dark:bg-green-950/30 dark:text-green-200">
						<CheckCircle className="h-4 w-4" />
						<AlertTitle>Success</AlertTitle>
						<AlertDescription>{successMsg}</AlertDescription>
					</Alert>
				)}
				{errorMsg && (
					<Alert variant="destructive" className="mb-3">
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{errorMsg}</AlertDescription>
					</Alert>
				)}

				<div className="grid grid-cols-2 gap-3 mb-2">
					<div>
						<div className="text-xs text-muted-foreground">Class ID</div>
						<div className="text-sm font-medium">{classId}</div>
					</div>
					<div>
						<div className="text-xs text-muted-foreground">Course ID</div>
						<div className="text-sm font-medium">{courseId}</div>
					</div>
					<div>
						<div className="text-xs text-muted-foreground">Course Date</div>
						<div className="text-sm font-medium">{courseDate}</div>
					</div>
					<div>
						<div className="text-xs text-muted-foreground">Term</div>
						<div className="text-sm font-medium">{term}</div>
					</div>
				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="student_id"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Student ID</FormLabel>
									<FormControl>
										<Input placeholder="STU001" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex justify-end gap-3 pt-2">
							<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
							<Button type="submit" disabled={submitting}>{submitting ? 'Adding...' : 'Add Student'}</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}


