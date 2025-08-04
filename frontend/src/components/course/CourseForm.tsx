import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Course, CourseFormData } from '@/types/course';

const courseFormSchema = z.object({
  name: z.string().min(1, "Course name is required").min(3, "Course name must be at least 3 characters"),
  duration: z.string().refine((val) => {
    const num = parseFloat(val)
    return !isNaN(num) && num > 0
  }, "Duration must be greater than 0"),
  start_date: z.date().refine((date) => {
    return date > new Date()
  }, "Start date must be in the future"),
  schedule: z.string().regex(
    /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)-(Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s\d{2}:\d{2}-\d{2}:\d{2}$/,
    "Schedule must be in format 'Day-Day, HH:MM-HH:MM' (e.g., 'Mon-Wed, 09:00-11:00')"
  ),
  fee: z.string().refine((val) => {
    const num = parseFloat(val)
    return !isNaN(num) && num > 0
  }, "Fee must be greater than 0"),
  prerequisites: z.string(),
  description: z.string().min(10, "Description must be at least 10 characters")
});

type FormData = z.infer<typeof courseFormSchema>;

interface CourseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (course: Course) => void;
}

const CourseForm: React.FC<CourseFormProps> = ({ open, onOpenChange, onSubmit }) => {
  const form = useForm<FormData>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      name: "",
      duration: "",
      start_date: new Date(),
      schedule: "",
      fee: "",
      prerequisites: "",
      description: ""
    }
  });

  const generateCourseId = () => {
    return `COURSE-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  };

  const handleSubmit = (data: FormData) => {
    const newCourse: Course = {
      id: generateCourseId(),
      name: data.name,
      duration: parseInt(data.duration),
      start_date: data.start_date!,
      schedule: data.schedule,
      fee: parseInt(data.fee),
      prerequisites: data.prerequisites || "",
      created_date: new Date(),
      description: data.description
    };
    
    onSubmit(newCourse);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Add New Course
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new course. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Course Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Introduction to React" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (weeks) *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 12" {...field} />
                    </FormControl>
                    <FormDescription>Duration must be greater than 0</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Fee ($) *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 299" {...field} />
                    </FormControl>
                    <FormDescription>Fee must be greater than 0</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date <= new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>Start date must be in the future</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="schedule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schedule *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Mon-Wed, 09:00-11:00" {...field} />
                    </FormControl>
                    <FormDescription>Format: Day-Day, HH:MM-HH:MM</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prerequisites"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Prerequisites</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Basic HTML/CSS knowledge" {...field} />
                    </FormControl>
                    <FormDescription>Optional: List any required prerequisites</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Course Description *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Provide a detailed description of the course content, objectives, and what students will learn..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Minimum 10 characters required</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Create Course
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CourseForm; 