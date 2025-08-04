import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import type { Course } from '@/types/course';

interface CourseGridProps {
  courses: Course[];
}

const CourseGrid: React.FC<CourseGridProps> = ({ courses }) => {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const toggleCardExpansion = (courseId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(courseId)) {
      newExpanded.delete(courseId);
    } else {
      newExpanded.add(courseId);
    }
    setExpandedCards(newExpanded);
  };

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
      {courses.map((course) => {
        const isExpanded = expandedCards.has(course.id);
        return (
          <Card 
            key={course.id} 
            className="hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 bg-gradient-to-br from-white to-gray-50 cursor-pointer"
            onClick={() => toggleCardExpansion(course.id)}
          >
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-800">{course.name}</CardTitle>
                  <CardDescription className="text-blue-600 font-medium">Course ID: {course.id}</CardDescription>
                </div>
                <button 
                  className="p-1 hover:bg-blue-100 rounded transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCardExpansion(course.id);
                  }}
                >
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-blue-600" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-blue-600" />
                  )}
                </button>
              </div>
            </CardHeader>
            <CardContent className={`space-y-3 p-4 ${isExpanded ? 'max-h-96 overflow-y-auto' : ''}`}>
            <div className="flex justify-between items-center py-2 px-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Duration:</span>
              <span className="text-sm font-bold text-blue-600">{course.duration} weeks</span>
            </div>
            <div className="flex justify-between items-center py-2 px-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Fee:</span>
              <span className="text-sm font-bold text-green-600">${course.fee}</span>
            </div>
            <div className="flex justify-between items-center py-2 px-3 bg-purple-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Start Date:</span>
              <span className="text-sm font-bold text-purple-600">{format(course.start_date, "MMM dd, yyyy")}</span>
            </div>
            <div className="flex justify-between items-center py-2 px-3 bg-orange-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Schedule:</span>
              <span className="text-sm font-bold text-orange-600">{course.schedule}</span>
            </div>
            <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Created:</span>
              <span className="text-sm font-bold text-gray-600">{format(course.created_date, "MMM dd, yyyy")}</span>
            </div>
            {course.prerequisites && (
              <div className="pt-3 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-700 block mb-1">Prerequisites:</span>
                <p className="text-sm text-gray-600 bg-yellow-50 p-2 rounded">{course.prerequisites}</p>
              </div>
            )}
            {course.description && (
              <div className="pt-3 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-700 block mb-1">Description:</span>
                <p className={`text-sm text-gray-600 bg-gray-50 p-2 rounded ${isExpanded ? '' : 'line-clamp-3'}`}>
                  {course.description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      );
    })}
    </div>
  );
};

export default CourseGrid; 