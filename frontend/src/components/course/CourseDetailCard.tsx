import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import type { Course } from '@/types/course';

interface CourseDetailCardProps {
  course: Course;
  onBackToGrid: () => void;
}

const CourseDetailCard: React.FC<CourseDetailCardProps> = ({ course, onBackToGrid }) => {
  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={onBackToGrid}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </Button>
      </div>

      {/* Course Detail Card */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                {course.name}
              </CardTitle>
              <CardDescription className="text-lg text-blue-600 font-medium">
                Course ID: {course.id}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between items-center py-3 px-4 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Duration:</span>
              <span className="text-sm font-bold text-blue-600">{course.duration} weeks</span>
            </div>
            <div className="flex justify-between items-center py-3 px-4 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Fee:</span>
              <span className="text-sm font-bold text-green-600">${course.fee}</span>
            </div>
            <div className="flex justify-between items-center py-3 px-4 bg-purple-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Start Date:</span>
              <span className="text-sm font-bold text-purple-600">{format(course.start_date, "MMM dd, yyyy")}</span>
            </div>
            <div className="flex justify-between items-center py-3 px-4 bg-orange-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Schedule:</span>
              <span className="text-sm font-bold text-orange-600">{course.schedule}</span>
            </div>
            <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Created:</span>
              <span className="text-sm font-bold text-gray-600">{format(course.created_date, "MMM dd, yyyy")}</span>
            </div>
          </div>
          
          {course.prerequisites && (
            <div className="pt-4 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-700 block mb-2">Prerequisites:</span>
              <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">{course.prerequisites}</p>
            </div>
          )}
          
          {course.description && (
            <div className="pt-4 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-700 block mb-2">Description:</span>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{course.description}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseDetailCard; 