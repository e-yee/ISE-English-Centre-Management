import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import type { CreateStudentData } from '@/services/entities/studentService';

const currentYear = new Date().getFullYear();
const studentFormSchema = z.object({
  fullname: z.string().min(1, 'Full name is required'),
  contact_info: z.string().min(1, 'Contact info is required'),
  day: z.string().min(1, 'Day is required'),
  month: z.string().min(1, 'Month is required'),
  year: z.string().min(4, 'Year is required'),
});

type FormData = z.infer<typeof studentFormSchema>;

interface StudentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (student: CreateStudentData) => Promise<boolean>;
  isCreating?: boolean;
  error?: string | null;
}

const StudentForm: React.FC<StudentFormProps> = ({ open, onOpenChange, onSubmit, isCreating = false, error = null }) => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      fullname: '',
      contact_info: '',
      day: '',
      month: '',
      year: String(currentYear),
    },
  });

  const handleSubmit = async (data: FormData) => {
    const day = data.day.padStart(2, '0');
    const month = data.month.padStart(2, '0');
    const year = data.year;
    const payload: CreateStudentData = {
      fullname: data.fullname,
      contact_info: data.contact_info,
      date_of_birth: `${year}-${month}-${day}`,
    };

    const success = await onSubmit(payload);
    if (success) {
      setSuccessMessage('Student created successfully!');
      form.reset();
      setTimeout(() => {
        setSuccessMessage(null);
        onOpenChange(false);
      }, 1200);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}> 
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add New Student
          </DialogTitle>
          <DialogDescription>Enter student details to create a new student.</DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 border border-red-200 bg-red-50 rounded-lg mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-800">{error}</span>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="p-3 border border-green-200 bg-green-50 rounded-lg mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-800">{successMessage}</span>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_info"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Info *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 0123-456-789 or john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-3">
              <FormField
                control={form.control}
                name="day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Day *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Day" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 31 }, (_, i) => String(i + 1)).map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
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
                name="month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Month *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
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
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 80 }, (_, i) => String(currentYear - i)).map((y) => (
                          <SelectItem key={y} value={y}>
                            {y}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? 'Creating...' : 'Create Student'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default StudentForm;
