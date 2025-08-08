import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useStudents } from '@/hooks/entities/useStudent';
import type { Student } from '@/types/student';
import StudentList from './components/StudentList';
import StudentProfilePanel from './components/StudentProfilePanel';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft } from 'lucide-react';
import StudentForm from '@/components/student/StudentForm';
import studentService, { type CreateStudentData } from '@/services/entities/studentService';
import { useNavigate } from 'react-router-dom';

const StudentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const { data: students, isLoading, error, refetch } = useStudents();
  const { user } = useAuth();
  const [openCreate, setOpenCreate] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const selectedStudent: Student | undefined = (students || []).find((s) => s.id === selectedStudentId);

  if (isLoading) {
    return (
      <div className={cn('h-full flex items-center justify-center')}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading students...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('h-full flex items-center justify-center')}>
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">Error: {error.message}</p>
          <button onClick={() => refetch()} className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('h-full overflow-hidden')}>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-white border border-black/20 rounded-[10px] shadow-[2px_2px_3px_0px_rgba(0,0,0,0.15)] px-4 py-2 transition-all duration-200 ease-in-out hover:shadow-[3px_3px_4px_0px_rgba(0,0,0,0.2)] hover:scale-105 focus:outline-none focus:ring-1 focus:ring-black focus:ring-offset-1 min-w-[90px]"
        >
          <div className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="text-[16px] font-semibold text-black leading-[1em] font-comfortaa whitespace-nowrap">Back</span>
          </div>
        </button>
        <h1 className="text-2xl font-semibold">Students</h1>
      </div>
      <div className={cn('h-full flex transition-all duration-500 ease-in-out', selectedStudentId ? 'detail-view-active' : '')}>
        <div className={cn('bg-white transition-all duration-500 ease-in-out flex-grow', selectedStudentId ? 'w-[40%] border-r border-gray-200' : 'w-full')}>
          <StudentList
            students={students || []}
            selectedStudentId={selectedStudentId}
            onSelect={setSelectedStudentId}
            headerActions={user?.role === 'Learning Advisor' ? (
              <Button size="sm" onClick={() => setOpenCreate(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            ) : undefined}
          />
        </div>

        <div className={cn('w-[60%] transition-all duration-500 ease-in-out absolute right-0 top-0 bottom-0 bg-white', selectedStudentId ? 'translate-x-0' : 'translate-x-full pointer-events-none')}>
          {selectedStudent && (
            <StudentProfilePanel
              student={selectedStudent}
              onMinimize={() => setSelectedStudentId(null)}
              onUpdated={() => refetch()}
            />
          )}
        </div>
      </div>

      {user?.role === 'Learning Advisor' && (
        <StudentForm
          open={openCreate}
          onOpenChange={setOpenCreate}
          isCreating={isCreating}
          error={createError}
          onSubmit={async (payload: CreateStudentData) => {
            try {
              setIsCreating(true);
              setCreateError(null);
              await studentService.createStudent(payload);
              await refetch();
              return true;
            } catch (e: any) {
              setCreateError(e?.message || 'Failed to create student');
              return false;
            } finally {
              setIsCreating(false);
            }
          }}
        />
      )}
    </div>
  );
};

export default StudentsPage;
