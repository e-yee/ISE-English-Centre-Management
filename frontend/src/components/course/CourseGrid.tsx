import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import type { Course } from '@/types/course';

interface CourseGridProps {
  courses: Course[];
  onCourseSelect: (course: Course) => void;
}

const CourseGrid: React.FC<CourseGridProps> = ({ courses, onCourseSelect }) => {
  if (courses.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first course using the "Add Course" button above.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <Card 
          key={course.id} 
          className="hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 bg-gradient-to-br from-white to-gray-50 cursor-pointer group"
          onClick={() => onCourseSelect(course)}
        >
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors">
                  {course.name}
                </CardTitle>
                <CardDescription className="text-blue-600 font-medium">
                  Course ID: {course.id}
                </CardDescription>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Click to view details
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CourseGrid; 