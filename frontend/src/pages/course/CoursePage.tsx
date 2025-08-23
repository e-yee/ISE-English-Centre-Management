import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import { getUserRole } from '@/lib/utils';

const CoursePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Fetch courses using the hook
  const { data: courses, isLoading: coursesLoading, error: coursesError } = useCourses();
  
  // Create course hook
  const { createCourse, isCreating, error: createError } = useCreateCourse();

  // If navigated from contracts with a course id, preselect that course when data is ready
  useEffect(() => {
    const state = location.state as { selectedCourseId?: string } | null;
    if (!selectedCourse && state?.selectedCourseId && courses && courses.length > 0) {
      const course = courses.find(c => c.id === state.selectedCourseId) || null;
      if (course) {
        setSelectedCourse(course);
        // Clear state so user can go back to the courses grid afterward
        navigate(location.pathname, { replace: true, state: null });
      }
    }
  }, [location.state, courses, selectedCourse, navigate, location.pathname]);

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleBackToGrid = () => {
    setSelectedCourse(null);
  };

  const handleClassesClick = () => {
    if (selectedCourse) {
      navigate(`/course-classes/${selectedCourse.id}/${selectedCourse.created_date}`);
    }
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

  const userRole = getUserRole();
  const isManager = userRole === 'Manager';

  return (
    <div className="h-full bg-gray-50 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header - match ClassScreen theme and color */}
        <div className="pt-4 pb-3 flex-shrink-0 transition-all duration-300 ease-in-out px-4">
          <div className="flex items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
              {!selectedCourse && (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-white border border-black/20 rounded-[10px] shadow-[2px_2px_3px_0px_rgba(0,0,0,0.15)] px-4 py-2 transition-all duration-200 ease-in-out hover:shadow-[3px_3px_4px_0px_rgba(0,0,0,0.2)] hover:scale-105 focus:outline-none focus:ring-1 focus:ring-black focus:ring-offset-1 min-w-[90px]"
                >
                  <span className="text-[16px] font-semibold text-black leading-[1em] font-comfortaa whitespace-nowrap">Back</span>
                </button>
              )}
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
            </div>
            <div className="flex items-center gap-2">
              {!selectedCourse && !isManager && (
                <Button className="flex items-center gap-2" onClick={() => setIsFormOpen(true)}>
                  + Add Course
                </Button>
              )}
          </div>
          </div>
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