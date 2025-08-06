import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CourseGrid from '@/components/course/CourseGrid';
import CourseForm from '@/components/course/CourseForm';
import CourseDetailCard from '@/components/course/CourseDetailCard';
import ClassesCard from '@/components/course/ClassesCard';
import ContractsCard from '@/components/course/ContractsCard';
import type { Course } from '@/types/course';
import { mockCourses } from '@/mockData/courseMock';
import { mockContracts } from '@/mockData/contractMock';
import { mockClasses } from '@/mockData/classMock';

const CoursePage: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

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

  const handleAddCourse = (newCourse: Course) => {
    setCourses(prev => [...prev, newCourse]);
    setIsFormOpen(false);
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
                courseId={selectedCourse.id}
                onClick={handleClassesClick}
                summaryOnly
              />
              <ContractsCard 
                contracts={mockContracts} 
                courseId={selectedCourse.id}
                onClick={handleContractsClick}
                summaryOnly
              />
            </div>
          </div>
        ) : (
          <>
            <CourseGrid 
              courses={courses} 
              onCourseSelect={handleCourseSelect}
            />
            {/* Course Form Dialog */}
            <CourseForm 
              open={isFormOpen}
              onOpenChange={setIsFormOpen}
              onSubmit={handleAddCourse}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CoursePage; 