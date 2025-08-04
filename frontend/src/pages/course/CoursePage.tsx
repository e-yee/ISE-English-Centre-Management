import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen } from 'lucide-react';
import CourseForm from '@/components/course/CourseForm';
import CourseGrid from '@/components/course/CourseGrid';
import type { Course } from '@/types/course';
import { mockCourses } from '@/mockData/courseMock';

const CoursePage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>(mockCourses);

  const handleAddCourse = (newCourse: Course) => {
    setCourses(prev => [...prev, newCourse]);
    setIsFormOpen(false);
  };

  return (
    <div className="h-full bg-background p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Course Management</h1>
            <p className="text-muted-foreground">Manage and add new courses to your curriculum</p>
          </div>
          
          <Button 
            className="flex items-center gap-2"
            onClick={() => setIsFormOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add Course
          </Button>
        </div>

        {/* Course Grid */}
        <CourseGrid courses={courses} />

        {/* Course Form Dialog */}
        <CourseForm 
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={handleAddCourse}
        />
      </div>
    </div>
  );
};

export default CoursePage; 