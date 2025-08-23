import { useMemo, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import courseService from "@/services/entities/courseService";
import classService from "@/services/entities/classService";
import employeeService from "@/services/entities/employeeService";
import makeupClassService from "@/services/entities/makeupClassService";
import type { CreateMakeupClassesPayload } from "@/services/entities/makeupClassService";

const schema = z.object({
  courseId: z.string().min(1, "Required"),
  courseDate: z.string().min(1, "Required"),
  levelChoice: z.string().min(1, "Required"),
  classId: z.string().min(1, "Required"),
  term: z.coerce.number().int().positive("Invalid term"),
  teacherId: z.string().min(1, "Required"),
  roomId: z.string().min(1, "Required"),
});

type FormValues = z.infer<typeof schema>;

export default function MakeupClassesPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      courseId: "",
      courseDate: "",
      levelChoice: "",
      classId: "",
      term: 1,
      teacherId: "",
      roomId: "",
    },
  });

  const [courses, setCourses] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  // const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Lazy loaders: only fetch when dropdown opens
  const loadCourses = async () => {
    if (courses.length === 0) {
      try { setCourses(await courseService.getAllCourses()); } catch (e) { /* noop */ }
    }
  };
  const loadTeachers = async () => {
    if (teachers.length === 0) {
      try { setTeachers(await employeeService.getAvailableTeachers()); } catch { setTeachers([]); }
    }
  };
  const loadClasses = async () => {
    const { courseId, courseDate } = form.getValues();
    if (courseId && courseDate) {
      try { setClasses(await classService.getAllClassesByCourse(courseId, courseDate)); } catch { setClasses([]); }
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const payload: CreateMakeupClassesPayload = {
      level_choice: values.levelChoice,
      class_id: values.classId,
      course_date: values.courseDate,
      term: values.term,
      teacher_id: values.teacherId,
      room_id: values.roomId,
    };
    setLoading(true);
    try {
      await makeupClassService.createMakeupClasses(payload);
      form.reset();
      alert("Makeup Classes created successfully");
    } catch (e: any) {
      alert(e?.message || "Failed to create makeup classes");
    } finally {
      setLoading(false);
    }
  };

  const courseOptions = useMemo(() => courses.map((c) => ({ id: c.id, date: c.created_date, name: c.name })), [courses]);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Create Makeup Classes</h2>
      <Form {...(form as any)}>
        <form onSubmit={form.handleSubmit(onSubmit as any)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Hidden but managed field for backend: level_choice */}
          <input type="hidden" {...form.register("levelChoice")} />
          <FormField name="courseId" control={form.control as any} render={({ field }) => (
            <FormItem>
              <FormLabel>Course</FormLabel>
              <FormControl>
                <Select
                  onOpenChange={(open) => { if (open) loadCourses(); }}
                  onValueChange={(val) => {
                    field.onChange(val);
                    // update levelChoice when course changes
                    const cDate = form.getValues("courseDate");
                    const selected = courses.find((c) => c.id === val && c.created_date === cDate);
                    form.setValue("levelChoice", selected?.name ?? "");
                    setClasses([]);
                  }}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courseOptions.map((c) => (
                      <SelectItem key={`${c.id}_${c.date}`} value={c.id}>{c.name} ({c.id})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="courseDate" control={form.control as any} render={({ field }) => (
            <FormItem>
              <FormLabel>Course Date</FormLabel>
              <FormControl>
                <Select
                  onOpenChange={(open) => { if (open) loadCourses(); }}
                  onValueChange={(val) => {
                    field.onChange(val);
                    // update levelChoice when course date changes
                    const cId = form.getValues("courseId");
                    const selected = courses.find((c) => c.id === cId && c.created_date === val);
                    form.setValue("levelChoice", selected?.name ?? "");
                    setClasses([]);
                  }}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select course date" />
                  </SelectTrigger>
                  <SelectContent>
                    {courseOptions.map((c) => (
                      <SelectItem key={`${c.id}_${c.date}`} value={c.date}>{c.date}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="classId" control={form.control as any} render={({ field }) => (
            <FormItem>
              <FormLabel>Class</FormLabel>
              <FormControl>
                <Select
                  onOpenChange={(open) => { if (open) loadClasses(); }}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>{cls.id}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="term" control={form.control as any} render={({ field }) => (
            <FormItem>
              <FormLabel>Term</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="teacherId" control={form.control as any} render={({ field }) => (
            <FormItem>
              <FormLabel>Teacher</FormLabel>
              <FormControl>
                <Select
                  onOpenChange={(open) => { if (open) loadTeachers(); }}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select available teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.full_name ?? t.id}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="roomId" control={form.control as any} render={({ field }) => (
            <FormItem>
              <FormLabel>Room ID</FormLabel>
              <FormControl>
                <Input placeholder="ROOM001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <div className="col-span-1 md:col-span-2 flex gap-3">
            <Button type="submit" disabled={loading}>{loading ? "Submitting..." : "Create"}</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}


