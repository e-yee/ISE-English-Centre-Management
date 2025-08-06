import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import CourseGrid from '@/components/course/CourseGrid';
import CourseForm from '@/components/course/CourseForm';
import CourseDetailCard from '@/components/course/CourseDetailCard';
import ClassesCard from '@/components/course/ClassesCard';
import ContractsCard from '@/components/course/ContractsCard';
import { useCourses, useCreateCourse } from '@/hooks/entities/useCourses';
import type { Course } from '@/types/course';
import type { CreateCourseData } from '@/services/entities/courseService';
import { mockContracts } from '@/mockData/contractMock';
import { mockClasses } from '@/mockData/classMock';

const CoursePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Fetch courses using the hook
  const { data: courses, isLoading: coursesLoading, error: coursesError } = useCourses();
  
  // Create course hook
  const { createCourse, isCreating, error: createError } = useCreateCourse();

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleBackToGrid = () => {
    setSelectedCourse(null);
  };

  const handleClassesClick = () => {
    alert('Navigate to classes page for course: ' + selectedCourse?.id);
  };

  const handleContractsClick = () => {
    if (selectedCourse) {
      navigate(`/contracts/${selectedCourse.id}`);
    }
  };

  const handleAddCourse = async (courseData: CreateCourseData) => {
    const result = await createCourse(courseData);
    if (result) {
      setIsFormOpen(false);
      // The courses will be refetched automatically by the hook
    }
    return !!result;
  };

  return (
    <div className="h-full bg-background p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header - match ClassScreen theme and color */}
        <div className="pt-4 pb-3 flex-shrink-0 transition-all duration-300 ease-in-out px-4 flex items-center justify-between">
          <div>
            <h1
              className="text-[60px] font-normal leading-[1.4em] text-center font-comfortaa"
              style={{
                background: 'linear-gradient(135deg, #AB2BAF 0%, #471249 100%), linear-gradient(90deg, #E634E1 0%, #E634E1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Course Management
            </h1>
            <p className="text-muted-foreground">Manage and view course details</p>
          </div>
          {/* Add Course Button (only show in grid view) */}
          {!selectedCourse && (
            <Button className="flex items-center gap-2" onClick={() => setIsFormOpen(true)}>
              + Add Course
            </Button>
          )}
        </div>

        {/* Error Messages */}
        {coursesError && (
          <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-800">Failed to load courses: {coursesError.message}</span>
            </div>
          </div>
        )}

        {/* Main Content */}
        {selectedCourse ? (
          <div className="space-y-6">
            <CourseDetailCard 
              course={selectedCourse} 
              onBackToGrid={handleBackToGrid}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ClassesCard 
                classes={mockClasses} 
                courseId={selectedCourse.id || ''}
                onClick={handleClassesClick}
                summaryOnly
              />
              <ContractsCard 
                contracts={mockContracts} 
                courseId={selectedCourse.id || ''}
                onClick={handleContractsClick}
                summaryOnly
              />
            </div>
          </div>
        ) : (
          <>
            {coursesLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-sm text-muted-foreground">Loading courses...</p>
              </div>
            ) : (
              <CourseGrid 
                courses={courses || []} 
                onCourseSelect={handleCourseSelect}
              />
            )}
            {/* Course Form Dialog */}
            <CourseForm 
              open={isFormOpen}
              onOpenChange={setIsFormOpen}
              onSubmit={handleAddCourse}
              isCreating={isCreating}
              error={createError}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CoursePage; 