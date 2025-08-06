import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CreateContractData } from '@/types/contract';
import type { Course } from '@/types/course';
import { mockStudents } from '@/mockData/studentMock';

const contractFormSchema = z.object({
  student_id: z.string().min(1, "Student is required"),
  course_id: z.string().min(1, "Course is required"),
  course_date: z.date().refine((date) => {
    return date <= new Date()
  }, "Course date must be today or in the past"),
});

type FormData = z.infer<typeof contractFormSchema>;

interface ContractFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (contractData: CreateContractData) => void;
  selectedCourse: Course | null;
  isCreating?: boolean;
}

const ContractForm: React.FC<ContractFormProps> = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  selectedCourse,
  isCreating = false 
}) => {
  const form = useForm<FormData>({
    resolver: zodResolver(contractFormSchema),
    defaultValues: {
      student_id: "",
      course_id: selectedCourse?.id || "",
      course_date: new Date(),
    }
  });

  // Update form when selectedCourse changes
  React.useEffect(() => {
    if (selectedCourse) {
      form.setValue('course_id', selectedCourse.id);
    }
  }, [selectedCourse, form]);

  const handleSubmit = (data: FormData) => {
    const contractData: CreateContractData = {
      student_id: data.student_id,
      course_id: data.course_id,
      course_date: format(data.course_date, 'yyyy-MM-dd'), // Convert to ISO string
    };
    
    onSubmit(contractData);
    form.reset();
  };

  if (!selectedCourse) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Add New Contract
          </DialogTitle>
          <DialogDescription>
            Create a new contract for {selectedCourse.name}. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="student_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a student" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockStudents.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{student.fullname}</span>
                              <span className="text-xs text-muted-foreground">{student.contact_info}</span>
                            </div>
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
                name="course_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        value={selectedCourse.name}
                        disabled
                        className="bg-gray-50"
                      />
                    </FormControl>
                    <FormDescription>
                      Course: {selectedCourse.name} • ${selectedCourse.fee} • {selectedCourse.duration} months
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="course_date"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Course Date *</FormLabel>
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
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Select the date when this course was created
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? 'Creating...' : 'Create Contract'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ContractForm; 