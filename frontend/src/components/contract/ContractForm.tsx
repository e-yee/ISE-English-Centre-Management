import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, FileText, AlertCircle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CreateContractData, UpdateContractData } from '@/types/contract';
import type { Course } from '@/types/course';
import type { Contract } from '@/types/contract';

const contractFormSchema = z.object({
  student_id: z.string().min(1, "Student ID is required"),
  course_id: z.string().min(1, "Course is required"),
  course_date: z.date().refine((date) => {
    return date <= new Date()
  }, "Course date must be today or in the past"),
	payment_status: z.enum(['In Progress', 'Paid']),
});

type FormData = z.infer<typeof contractFormSchema>;

interface ContractFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (contractData: CreateContractData | UpdateContractData) => Promise<boolean>;
  selectedCourse: Course | null;
  isCreating?: boolean;
  error?: string | null;
  editingContract?: Contract | null;
  /**
   * Prefilled course date (yyyy-MM-dd). When provided in create mode, the date picker is initialized to this
   * value and disabled to prevent changing it.
   */
  courseDate?: string;
}

const ContractForm: React.FC<ContractFormProps> = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  selectedCourse,
  isCreating = false,
  error = null,
  editingContract = null,
  courseDate
}) => {
  const form = useForm<FormData>({
    resolver: zodResolver(contractFormSchema) as any,
    defaultValues: {
      student_id: editingContract?.student_id || "",
      course_id: selectedCourse?.id || "",
      course_date: editingContract?.course_date
        ? new Date(editingContract.course_date)
        : (courseDate ? new Date(courseDate) : new Date()),
      payment_status: ((editingContract?.payment_status as any) ?? 'In Progress') as 'In Progress' | 'Paid',
    }
  });

  // Update form when selectedCourse changes or when editing
  React.useEffect(() => {
    if (selectedCourse?.id) {
      form.setValue('course_id', selectedCourse.id);
    }
    if (editingContract) {
      form.setValue('student_id', editingContract.student_id);
      form.setValue('course_date', new Date(editingContract.course_date));
      form.setValue('payment_status', editingContract.payment_status as any);
    } else if (courseDate) {
      form.setValue('course_date', new Date(courseDate));
    }
  }, [selectedCourse, editingContract, courseDate, form]);

  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  const handleSubmit = async (data: FormData) => {
    if (editingContract) {
      // Update mode
      const updateData: UpdateContractData = {
        student_id: data.student_id,
        course_date: format(data.course_date, 'yyyy-MM-dd'),
      };
      const ok = await onSubmit(updateData);
      if (ok) {
        setSuccessMsg('Contract updated successfully');
        form.reset();
      }
    } else {
      // Create mode
      const contractData: CreateContractData = {
        student_id: data.student_id,
        course_id: data.course_id,
        course_date: format(data.course_date, 'yyyy-MM-dd'),
      };
      const ok = await onSubmit(contractData);
      if (ok) {
        setSuccessMsg('Contract created successfully');
        form.reset();
      }
    }
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
            {editingContract ? 'Edit Contract' : 'Add New Contract'}
          </DialogTitle>
          <DialogDescription>
            {editingContract 
              ? `Edit contract for ${selectedCourse?.name || 'the selected course'}.`
              : `Create a new contract for ${selectedCourse?.name || 'the selected course'}. All fields marked with * are required.`
            }
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit as any)} className="space-y-6">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {/* Success Alert */}
            {successMsg && (
              <Alert className="border-green-300 bg-green-50 text-green-800 dark:border-green-700 dark:bg-green-950/30 dark:text-green-200">
                <Check className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{successMsg}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="student_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student ID *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter student ID (e.g., STU001)"
                        disabled={isCreating}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the student ID for the contract
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Bind actual course_id to a hidden input while displaying course name read-only */}
              <FormField
                control={form.control}
                name="course_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course *</FormLabel>
                    <FormControl>
                      <>
                        <input type="hidden" {...field} value={selectedCourse?.id || field.value || ''} />
                        <Input 
                          value={selectedCourse?.name || ''}
                          disabled
                          className="bg-gray-50"
                        />
                      </>
                    </FormControl>
                    <FormDescription>
                      Course: {selectedCourse?.name || ''} • ${selectedCourse?.fee || 0} • {selectedCourse?.duration || 0} months
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
                            disabled={!!courseDate || isCreating}
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
                          disabled={(date) => !!courseDate || date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      {courseDate ? 'Using prefilled course date' : 'Select the date when this course was created'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payment Method (checkbox -> Paid when checked, In Progress when unchecked) */}
              <FormField
                control={form.control}
                name="payment_status"
                render={({ field }) => {
                  const isPaid = field.value === 'Paid';
                  return (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <FormControl>
                        <button
                          type="button"
                          onClick={() => field.onChange(isPaid ? 'In Progress' : 'Paid')}
                          className={cn(
                            'w-full flex items-center justify-between px-3 py-2 border rounded-md transition-colors',
                            isPaid ? 'border-green-500 bg-green-50 text-green-800' : 'border-gray-300 bg-white'
                          )}
                        >
                          <span className="text-sm">{isPaid ? 'Paid' : 'In Progress'}</span>
                          {isPaid && <Check className="h-4 w-4" />}
                        </button>
                      </FormControl>
                      <FormDescription>
                        Tick to mark as Paid; unticked means In Progress.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
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
                {isCreating ? (editingContract ? 'Updating...' : 'Creating...') : (editingContract ? 'Update Contract' : 'Create Contract')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ContractForm; 