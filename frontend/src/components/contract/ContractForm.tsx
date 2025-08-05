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
import { CalendarIcon, FileText, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Contract, ContractFormData } from '@/types/contract';
import { mockStudents } from '@/mockData/studentMock';
import { mockEmployees } from '@/mockData/employeeMock';
import { mockCourses } from '@/mockData/courseMock';

const contractFormSchema = z.object({
  student_id: z.string().min(1, "Student is required"),
  employee_id: z.string().min(1, "Employee is required"),
  course_id: z.string().min(1, "Course is required"),
  course_date: z.date().refine((date) => {
    return date <= new Date()
  }, "Course date must be today or in the past"),
  tuition_fee: z.string().refine((val) => {
    const num = parseFloat(val)
    return !isNaN(num) && num > 0
  }, "Tuition fee must be greater than 0"),
  start_date: z.date().refine((date) => {
    return date >= new Date()
  }, "Start date must be today or in the future"),
  end_date: z.date(),
  payment_status: z.enum(['In Progress', 'Paid']),
  description: z.string().optional()
}).refine((data) => data.end_date > data.start_date, {
  message: "End date must be after start date",
  path: ["end_date"],
});

type FormData = z.infer<typeof contractFormSchema>;

interface ContractFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (contract: Contract) => void;
}

const ContractForm: React.FC<ContractFormProps> = ({ open, onOpenChange, onSubmit }) => {
  const form = useForm<FormData>({
    resolver: zodResolver(contractFormSchema),
    defaultValues: {
      student_id: "",
      employee_id: "",
      course_id: "",
      course_date: new Date(),
      tuition_fee: "",
      start_date: new Date(),
      end_date: new Date(),
      payment_status: "In Progress",
      description: ""
    }
  });

  const generateContractId = () => {
    return `CON${Date.now().toString().slice(-6)}`;
  };

  const handleSubmit = (data: FormData) => {
    const newContract: Contract = {
      id: generateContractId(),
      student_id: data.student_id,
      employee_id: data.employee_id,
      course_id: data.course_id,
      course_date: data.course_date!,
      tuition_fee: parseInt(data.tuition_fee),
      payment_status: data.payment_status,
      start_date: data.start_date!,
      end_date: data.end_date!,
      description: data.description
    };
    
    onSubmit(newContract);
    form.reset();
  };

  // Auto-fill tuition fee when course is selected
  const handleCourseChange = (courseId: string) => {
    const selectedCourse = mockCourses.find(course => course.id === courseId);
    if (selectedCourse) {
      form.setValue('tuition_fee', selectedCourse.fee.toString());
    }
    form.setValue('course_id', courseId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Add New Contract
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new contract. All fields marked with * are required.
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
                name="employee_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an employee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockEmployees
                          .filter(emp => emp.role === 'Learning Advisor')
                          .map((employee) => (
                            <SelectItem key={employee.id} value={employee.id}>
                              <div className="flex flex-col">
                                <span className="font-medium">{employee.fullname}</span>
                                <span className="text-xs text-muted-foreground">{employee.role}</span>
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
                  <FormItem className="md:col-span-2">
                    <FormLabel>Course *</FormLabel>
                    <Select onValueChange={handleCourseChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a course" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockCourses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{course.name}</span>
                              <span className="text-xs text-muted-foreground">
                                ${course.fee} • {course.duration} months • {course.schedule}
                              </span>
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
                name="course_date"
                render={({ field }) => (
                  <FormItem>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tuition_fee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tuition Fee ($) *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 299" {...field} />
                    </FormControl>
                    <FormDescription>Amount will auto-fill when course is selected</FormDescription>
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
                          disabled={(date) => date < new Date()}
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
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date *</FormLabel>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="payment_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Status *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Provide details about the contract, payment arrangements, or special notes..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
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
                Create Contract
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ContractForm; 