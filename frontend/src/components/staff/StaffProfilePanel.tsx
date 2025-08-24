import React, { useState } from 'react';
import type { Colleague } from '@/mockData/colleaguesMock';
import { Card, CardContent } from '@/components/ui/card';
import Avatar from '@/components/ui/Avatar';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import DeleteConfirmationModal from '@/components/notifications/DeleteConfirmationModal';
import employeeService from '@/services/entities/employeeService';
import StaffForm, { type CreateStaffData } from '@/components/staff/StaffForm';
import { useAuth } from '@/contexts/AuthContext';
import { useUpdateProfile } from '@/hooks/entities/useEmployees';

interface StaffProfilePanelProps {
  colleague: Colleague;
  onMinimize?: () => void;
  onUpdated?: () => void;
  role?: string;
}

const AttributeCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <Card>
    <CardContent className="p-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">{title}</label>
      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md max-h-[120px] overflow-y-auto">
        {children}
      </div>
    </CardContent>
  </Card>
);

const StaffProfilePanel: React.FC<StaffProfilePanelProps> = ({ colleague, onMinimize, onUpdated, role }) => {
  const [openDelete, setOpenDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const { user } = useAuth();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { updateProfile, isUpdating, error: updateError } = useUpdateProfile();

  if (!colleague) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-500">
          <p className="text-lg">No staff selected</p>
          <p className="text-sm">Select a staff member from the list to view their profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto relative">
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <Button size="icon" variant="outline" title="Edit" onClick={() => setOpenEdit(true)}>
          <Pencil className="w-4 h-4" />
        </Button>
        {onMinimize && (
          <button
            onClick={onMinimize}
            className="p-2 cursor-pointer hover:bg-pink-200 rounded-full transition-colors"
            title="Minimize panel"
          >
            <img src="/src/assets/colleague_minimize.svg" alt="Minimize" className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom-right floating delete button */}
      <div className="absolute bottom-4 right-4 z-20">
        <Button size="icon" variant="destructive" title="Delete" onClick={() => setOpenDelete(true)}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="relative mb-8 pb-16">
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-blue-100 to-blue-50 rounded-t-lg overflow-hidden">
          <img src="/src/assets/frame.svg" alt="Background frame" className="w-full h-full object-cover opacity-50" />
        </div>
        <div className="relative pt-21 px-6">
          <div className="flex items-end">
            <Avatar
              name={colleague.name}
              src={colleague.avatar}
              size="xl"
              className="mr-6 z-10 border-4 border-white shadow-lg"
            />
            <div className="z-10 pb-4">
              <h1 className="text-3xl font-bold text-gray-900 font-comfortaa mb-2">{colleague.name}</h1>
              <p className="text-lg text-gray-600">{colleague.email} | {colleague.phone}</p>
              {role && (
                <p className="text-sm text-purple-700 font-medium mt-1">Role: {role}</p>
              )}
              <p className="text-sm text-blue-600 font-medium mt-1">Employee ID: {colleague.id}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 grid grid-cols-2 gap-6">
        <div className="space-y-6">
          <AttributeCard title="Nickname">
            <p>{colleague.nickname}</p>
          </AttributeCard>
          <AttributeCard title="Philosophy">
            <p>{colleague.philosophy}</p>
          </AttributeCard>
          <AttributeCard title="Contact">
            <div>
              <p>Email: {colleague.email}</p>
              <p className="mt-1">Phone: {colleague.phone}</p>
            </div>
          </AttributeCard>
        </div>

        <div className="space-y-6">
          <AttributeCard title="Achievements">
            <p>{colleague.achievements}</p>
          </AttributeCard>
          <AttributeCard title="Courses Teaching">
            {colleague.courses.length > 0 ? (
              <div className="space-y-3">
                {colleague.courses.map((course) => (
                  <div key={course.id} className="border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                    <h3 className="font-medium text-gray-900 text-sm">{course.name}</h3>
                    <p className="text-xs text-gray-600 mt-1">{course.time}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-3 text-gray-500">
                <p className="text-sm">No courses assigned</p>
              </div>
            )}
          </AttributeCard>
        </div>
      </div>

      <DeleteConfirmationModal
        open={openDelete}
        onOpenChange={setOpenDelete}
        itemName={`staff "${colleague.name}"`}
        onConfirm={async () => {
          try {
            setIsDeleting(true);
            setDeleteError(null);
            await employeeService.managerDeleteEmployee(String(colleague.id));
            setOpenDelete(false);
            onUpdated?.();
            setSuccessMessage('Staff deleted successfully!');
            setTimeout(() => setSuccessMessage(null), 1200);
          } catch (e: any) {
            setDeleteError(e?.message || 'Failed to delete staff');
          } finally {
            setIsDeleting(false);
          }
        }}
        confirmLoading={isDeleting}
        description={deleteError ?? undefined}
      />

      <StaffForm
        open={openEdit}
        onOpenChange={setOpenEdit}
        isSubmitting={isUpdating}
        error={updateError ?? editError}
        initialValues={{
          full_name: colleague.name,
          email: colleague.email,
          role: 'Teacher',
          phone_number: colleague.phone || '',
          nickname: colleague.nickname || '',
          philosophy: colleague.philosophy || '',
          achievements: colleague.achievements || '',
          teacher_status: '',
        }}
        onSubmit={async (payload: CreateStaffData) => {
          try {
            setEditError(null);
            // Backend supports only self update at /employee/update
            if (user?.id && String(user.id) === String(colleague.id)) {
              await updateProfile({
                full_name: payload.full_name,
                email: payload.email,
                nickname: payload.nickname ?? undefined,
                philosophy: payload.philosophy ?? undefined,
                achievements: payload.achievements ?? undefined,
                phone_number: payload.phone_number ?? undefined,
                teacher_status: payload.teacher_status ?? undefined,
              });
              onUpdated?.();
              setSuccessMessage('Profile updated successfully!');
              setTimeout(() => {
                setSuccessMessage(null);
                setOpenEdit(false);
              }, 1200);
              return true;
            }
            setEditError('Editing other staff is not supported by the backend yet.');
            return false;
          } catch (e: any) {
            setEditError(e?.message || 'Failed to update staff');
            return false;
          }
        }}
      />

      {successMessage && (
        <div className="fixed top-4 right-4 z-30 p-3 border border-green-200 bg-green-50 rounded-lg shadow">
          <span className="text-sm text-green-800">{successMessage}</span>
        </div>
      )}
    </div>
  );
};

export default StaffProfilePanel;



