import React, { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Avatar from '@/components/ui/Avatar';
import type { Student } from '@/types/student';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Pencil, Save, X, CheckCircle, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import studentService from '@/services/entities/studentService';
import DeleteConfirmationModal from '@/components/notifications/DeleteConfirmationModal';
import { useDeleteStudent } from '@/hooks';

interface StudentProfilePanelProps {
  student: Student;
  onMinimize?: () => void;
  onUpdated?: () => void;
}

const AttributeCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <Card>
    <CardContent className="p-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">{title}</label>
      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md max-h-[120px] overflow-y-auto">{children}</div>
    </CardContent>
  </Card>
);

const StudentProfilePanel: React.FC<StudentProfilePanelProps> = ({ student, onMinimize, onUpdated }) => {
  const { user } = useAuth();
  const canEdit = user?.role === 'Learning Advisor';

  const [openEdit, setOpenEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const { deleteStudent, isDeleting, error: deleteError } = useDeleteStudent();

  const initial = useMemo(() => ({
    fullname: student.fullname,
    contact_info: student.contact_info,
    date_of_birth: (student.date_of_birth || '').slice(0, 10),
  }), [student]);

  const [fullname, setFullname] = useState(initial.fullname);
  const [contactInfo, setContactInfo] = useState(initial.contact_info);
  const [dob, setDob] = useState(initial.date_of_birth);

  // Reset form when opening/closing or student changes
  React.useEffect(() => {
    if (openEdit) {
      setFullname(initial.fullname);
      setContactInfo(initial.contact_info);
      setDob(initial.date_of_birth);
      setError(null);
    }
  }, [openEdit, initial]);

  const hasChanges = fullname !== initial.fullname || contactInfo !== initial.contact_info || dob !== initial.date_of_birth;

  const handleSave = async () => {
    if (!hasChanges) {
      setOpenEdit(false);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload: Record<string, string> = {};
      if (fullname !== initial.fullname) payload.fullname = fullname;
      if (contactInfo !== initial.contact_info) payload.contact_info = contactInfo;
      if (dob !== initial.date_of_birth) payload.date_of_birth = dob;
      await studentService.updateStudent(student.id, payload);
      setSuccessMessage('Student updated successfully!');
      setTimeout(() => {
        setSuccessMessage(null);
        setOpenEdit(false);
        onUpdated?.();
      }, 1200);
    } catch (e: any) {
      setError(e?.message || 'Failed to update student');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const ok = await deleteStudent(student.id);
    if (ok) {
      setOpenDelete(false);
      onUpdated?.();
    }
  };

  if (!student) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-500">
          <p className="text-lg">No student selected</p>
          <p className="text-sm">Select a student from the list to view their profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto relative">
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        {canEdit && (
          <Button size="icon" variant="outline" title="Edit" onClick={() => setOpenEdit(true)}>
            <Pencil className="w-4 h-4" />
          </Button>
        )}
        {onMinimize && (
          <button
            onClick={onMinimize}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Minimize panel"
          >
            <img src="/src/assets/colleague_minimize.svg" alt="Minimize" className="w-6 h-6" />
          </button>
        )}
      </div>

      <div className="relative mb-8 pb-16">
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-blue-100 to-blue-50 rounded-t-lg overflow-hidden">
          <img src="/src/assets/frame.svg" alt="Background frame" className="w-full h-full object-cover opacity-50" />
        </div>
        <div className="relative pt-21 px-6">
          <div className="flex items-end">
            <Avatar name={student.fullname} src="" size="xl" className="mr-6 z-10 border-4 border-white shadow-lg" />
            <div className="z-10 pb-4">
              <h1 className="text-3xl font-bold text-gray-900 font-comfortaa mb-2">{student.fullname}</h1>
              <p className="text-lg text-gray-600">{student.contact_info}</p>
              <p className="text-sm text-blue-600 font-medium mt-1">Student ID: {student.id}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 grid grid-cols-2 gap-6">
        <div className="space-y-6">
          <AttributeCard title="Contact">
            <p>{student.contact_info}</p>
          </AttributeCard>
        </div>

        <div className="space-y-6">
          <AttributeCard title="Date of Birth">
            <p>{student.date_of_birth}</p>
          </AttributeCard>
        </div>
      </div>

      {canEdit && (
        <div className="px-8 mt-6 flex justify-end">
          <Button
            variant="destructive"
            onClick={() => setOpenDelete(true)}
            className="gap-2"
            title="Delete student"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </Button>
        </div>
      )}

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">Edit Student</DialogTitle>
            <DialogDescription>Update student details. Only changed fields will be saved.</DialogDescription>
          </DialogHeader>

          {error && (
            <div className="p-3 border border-red-200 bg-red-50 rounded-lg mb-4 text-sm text-red-800">{error}</div>
          )}

          {successMessage && (
            <div className="p-3 border border-green-200 bg-green-50 rounded-lg mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-800">{successMessage}</span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <Input value={fullname} onChange={(e) => setFullname(e.target.value)} placeholder="e.g., John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contact Info</label>
              <Input value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} placeholder="e.g., 0123-456-789 or john@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date of Birth</label>
              <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpenEdit(false)} disabled={saving}>
              <X className="w-4 h-4 mr-1" /> Cancel
            </Button>
            <Button onClick={handleSave} disabled={!hasChanges || saving}>
              <Save className="w-4 h-4 mr-1" /> {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationModal
        open={openDelete}
        onOpenChange={setOpenDelete}
        itemName={`student "${student.fullname}"`}
        onConfirm={handleDelete}
        confirmLoading={isDeleting}
        description={deleteError ? deleteError : undefined}
      />
    </div>
  );
};

export default StudentProfilePanel;
