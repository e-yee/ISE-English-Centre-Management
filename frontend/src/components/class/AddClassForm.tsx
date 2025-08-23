import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import classService from '@/services/entities/classService';
import courseService from '@/services/entities/courseService';
import roomService from '@/services/entities/roomService';
import { useAvailableTeachers } from '@/hooks/entities/useEmployees';
import type { Room } from '@/types/room';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  course_id: z.string().min(1),
  course_date: z.string().min(1), // YYYY-MM-DD
  term: z.coerce.number().int().min(1),
  teacher_id: z.string().min(1),
  room_id: z.string().min(1),
  class_date_date: z.date(),
  class_date_time: z.string().regex(/^\d{2}:\d{2}$/), // HH:MM
});

type FormData = z.infer<typeof formSchema>;

interface AddClassFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
  courseDate: string;
  onSuccess?: () => void;
}

export default function AddClassForm({ open, onOpenChange, courseId, courseDate, onSuccess }: AddClassFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [rooms, setRooms] = useState<Room[] | null>(null);
  const roomsLoadedOnce = useRef(false);
  const [courseSchedule, setCourseSchedule] = useState<string | null>(null);
  const [allowedWeekdays, setAllowedWeekdays] = useState<number[]>([]);
  const [scheduleStart, setScheduleStart] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: teachers } = useAvailableTeachers();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      course_id: courseId || '',
      course_date: courseDate || '',
      term: 1,
      teacher_id: '',
      room_id: '',
      class_date_date: new Date(),
      class_date_time: '18:00',
    },
  });

  useEffect(() => {
    form.setValue('course_id', courseId || '');
    form.setValue('course_date', courseDate || '');
  }, [courseId, courseDate, form]);

  const loadRooms = useCallback(async () => {
    if (roomsLoadedOnce.current && rooms) return;
    try {
      const data = await roomService.listFree();
      setRooms(data);
    } finally {
      roomsLoadedOnce.current = true;
    }
  }, [rooms]);

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const course = await courseService.getCourseForAdvisor(courseId, courseDate);
        setCourseSchedule(course?.schedule ?? null);
        const match = /\d{2}:\d{2}/.exec(course?.schedule || '');
        if (match) {
          setScheduleStart(match[0]);
          form.setValue('class_date_time', match[0]);
        }

        const prefix = (course?.schedule || '').split(',')[0] || '';
        const days = prefix.split('-').map((s) => s.trim()).filter(Boolean) as Array<'Sun'|'Mon'|'Tue'|'Wed'|'Thu'|'Fri'|'Sat'>;
        const dayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
        const allowed = days.map((d) => dayMap[d]).filter((n) => n !== undefined);
        setAllowedWeekdays(allowed);

        const cur = form.getValues('class_date_date') as Date;
        if (cur && allowed.length > 0 && !allowed.includes(cur.getDay())) {
          const next = new Date();
          for (let i = 0; i < 21; i++) {
            if (allowed.includes(next.getDay())) { form.setValue('class_date_date', new Date(next)); break; }
            next.setDate(next.getDate() + 1);
          }
        }
      } catch (e: any) {
        setErrorMsg(e?.message || 'Failed to load course schedule');
      }
    })();
  }, [open, courseId, courseDate, form]);

  const onSubmit: SubmitHandler<FormData> = useCallback(async (data) => {
    setSubmitting(true);
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      const date = data.class_date_date;
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      const start = scheduleStart ?? data.class_date_time;
      const class_date = `${yyyy}-${mm}-${dd} ${start}:00`;

      await classService.createClass({
        course_id: data.course_id,
        course_date: data.course_date,
        term: data.term,
        teacher_id: data.teacher_id,
        room_id: data.room_id,
        class_date,
      });
      setSuccessMsg('Class created successfully');
      onSuccess?.();
      setTimeout(() => {
        setSuccessMsg(null);
        onOpenChange(false);
        form.reset({
          course_id: courseId || '',
          course_date: courseDate || '',
          term: 1,
          teacher_id: '',
          room_id: '',
          class_date_date: new Date(),
          class_date_time: '18:00',
        });
      }, 2000);
    } catch (e: any) {
      setErrorMsg(e?.message || 'Failed to create class');
    } finally {
      setSubmitting(false);
    }
  }, [courseDate, courseId, form, onOpenChange, onSuccess]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Class</DialogTitle>
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="course_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course ID</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="course_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Date</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="term"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Term</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="teacher_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teacher</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a teacher" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(teachers || []).map((t) => (
                          <SelectItem key={t.id} value={t.id!}>
                            {t.full_name} — {t.id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="room_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room</FormLabel>
                    {rooms && rooms.length > 0 ? (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger onClick={() => loadRooms()}>
                            <SelectValue placeholder="Select a room" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {rooms.map((r) => (
                            <SelectItem key={r.id} value={r.id}>{r.name} ({r.status})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input placeholder="Eg: ROOM001" onFocus={() => loadRooms()} {...field} />
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="class_date_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className={cn('w-full justify-start', !field.value && 'text-muted-foreground')}>
                            {field.value ? field.value.toDateString() : 'Pick a date'}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            if (!allowedWeekdays.length) return false;
                            return !allowedWeekdays.includes(date.getDay());
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="class_date_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time (HH:MM)</FormLabel>
                    <FormControl>
                      <Input placeholder="18:00" {...field} value={scheduleStart ?? field.value} disabled />
                    </FormControl>
                    {courseSchedule && (
                      <p className="text-sm text-muted-foreground">Schedule: {courseSchedule}</p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting}>{submitting ? 'Creating...' : 'Create Class'}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


