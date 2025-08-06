import React, { useState, useEffect } from 'react';
import { cn, getEmployeeIdFromToken } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateIssue } from '@/hooks/entities/useIssues';
import type { IssueFormData } from '@/types/issue';

interface IssueFormProps {
  className?: string;
}

const IssueForm: React.FC<IssueFormProps> = ({ className }) => {
  const [formData, setFormData] = useState<IssueFormData>({
    teacher_id: getEmployeeIdFromToken() || '',
    issue_type: '',
    issue_description: '',
    student_id: null,
    room_id: null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { createIssue, isLoading, error, success, clearMessages } = useCreateIssue();

  const handleIssueTypeChange = (value: 'Student Behavior' | 'Technical') => {
    setFormData(prev => ({
      ...prev,
      issue_type: value,
      // Clear the opposite field when switching types
      student_id: value === 'Technical' ? null : prev.student_id,
      room_id: value === 'Student Behavior' ? null : prev.room_id
    }));
    
    // Clear related errors
    const newErrors = { ...errors };
    delete newErrors.student_id;
    delete newErrors.room_id;
    delete newErrors.issue_type;
    setErrors(newErrors);
  };

  const handleInputChange = (field: keyof IssueFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value || null
    }));
    
    // Clear error for this field
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate required fields
    if (!formData.issue_type) {
      newErrors.issue_type = 'Issue type is required';
    }

    if (!formData.issue_description.trim()) {
      newErrors.issue_description = 'Issue description is required';
    }

    // Validate conditional fields
    if (formData.issue_type === 'Student Behavior' && !formData.student_id?.trim()) {
      newErrors.student_id = 'Student ID is required for Student Behavior issues';
    }

    if (formData.issue_type === 'Technical' && !formData.room_id?.trim()) {
      newErrors.room_id = 'Room ID is required for Technical issues';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Ensure teacher_id is included from JWT token
    const teacherId = getEmployeeIdFromToken();
    if (!teacherId) {
      setErrors({ ...errors, general: 'Teacher ID not found. Please log in again.' });
      return;
    }

    const issueData = {
      ...formData,
      teacher_id: teacherId
    };

    const result = await createIssue(issueData);
    
    if (result) {
      // Reset form on success
      setFormData({
        teacher_id: getEmployeeIdFromToken() || '',
        issue_type: '',
        issue_description: '',
        student_id: null,
        room_id: null
      });
    }
  };

  return (
    <Card className={cn('shadow-lg border-0 bg-white', className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-comfortaa font-bold" style={{ color: '#945CD8' }}>
          Report New Issue
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error and Success Messages */}
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          {errors.general && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors.general}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}
          {/* Issue Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="issue_type" className="text-sm font-comfortaa font-medium text-gray-700">
              Issue Type <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.issue_type} onValueChange={handleIssueTypeChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select issue type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Student Behavior">Student Behavior</SelectItem>
                <SelectItem value="Technical">Technical</SelectItem>
              </SelectContent>
            </Select>
            {errors.issue_type && (
              <p className="text-red-500 text-xs font-comfortaa">{errors.issue_type}</p>
            )}
          </div>

          {/* Issue Description */}
          <div className="space-y-2">
            <Label htmlFor="issue_description" className="text-sm font-comfortaa font-medium text-gray-700">
              Issue Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="issue_description"
              placeholder="Describe the issue in detail..."
              value={formData.issue_description}
              onChange={(e) => handleInputChange('issue_description', e.target.value)}
              className="min-h-[100px] resize-none font-comfortaa"
              rows={4}
            />
            {errors.issue_description && (
              <p className="text-red-500 text-xs font-comfortaa">{errors.issue_description}</p>
            )}
          </div>

          {/* Conditional Fields */}
          {formData.issue_type === 'Student Behavior' && (
            <div className="space-y-2">
              <Label htmlFor="student_id" className="text-sm font-comfortaa font-medium text-gray-700">
                Student ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="student_id"
                type="text"
                placeholder="Enter student ID (e.g., STD001)"
                value={formData.student_id || ''}
                onChange={(e) => handleInputChange('student_id', e.target.value)}
                className="font-comfortaa"
              />
              {errors.student_id && (
                <p className="text-red-500 text-xs font-comfortaa">{errors.student_id}</p>
              )}
            </div>
          )}

          {formData.issue_type === 'Technical' && (
            <div className="space-y-2">
              <Label htmlFor="room_id" className="text-sm font-comfortaa font-medium text-gray-700">
                Room ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="room_id"
                type="text"
                placeholder="Enter room ID (e.g., ROOM101)"
                value={formData.room_id || ''}
                onChange={(e) => handleInputChange('room_id', e.target.value)}
                className="font-comfortaa"
              />
              {errors.room_id && (
                <p className="text-red-500 text-xs font-comfortaa">{errors.room_id}</p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white font-comfortaa font-semibold px-8 py-2"
              style={{ backgroundColor: isLoading ? '#9CA3AF' : '#945CD8' }}
            >
              {isLoading ? 'SUBMITTING...' : 'SUBMIT ISSUE'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default IssueForm;