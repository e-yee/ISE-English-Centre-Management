import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type CreateStaffData = {
  full_name: string;
  email: string;
  role: 'Teacher' | 'Learning Advisor';
  phone_number?: string | null;
  nickname?: string | null;
  philosophy?: string | null;
  achievements?: string | null;
  teacher_status?: string | null;
};

interface StaffFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSubmitting?: boolean;
  error?: string | null;
  initialValues?: Partial<CreateStaffData>;
  onSubmit: (payload: CreateStaffData) => Promise<boolean>;
}

const StaffForm: React.FC<StaffFormProps> = ({ open, onOpenChange, isSubmitting, error, initialValues, onSubmit }) => {
  const [fullName, setFullName] = React.useState(initialValues?.full_name || '');
  const [email, setEmail] = React.useState(initialValues?.email || '');
  const [role, setRole] = React.useState<CreateStaffData['role']>((initialValues?.role as any) || 'Teacher');
  const [phone, setPhone] = React.useState(initialValues?.phone_number || '');
  const [nickname, setNickname] = React.useState(initialValues?.nickname || '');
  const [philosophy, setPhilosophy] = React.useState(initialValues?.philosophy || '');
  const [achievements, setAchievements] = React.useState(initialValues?.achievements || '');
  const [teacherStatus, setTeacherStatus] = React.useState(initialValues?.teacher_status || '');

  React.useEffect(() => {
    if (open) {
      setFullName(initialValues?.full_name || '');
      setEmail(initialValues?.email || '');
      setRole((initialValues?.role as any) || 'Teacher');
      setPhone(initialValues?.phone_number || '');
      setNickname(initialValues?.nickname || '');
      setPhilosophy(initialValues?.philosophy || '');
      setAchievements(initialValues?.achievements || '');
      setTeacherStatus(initialValues?.teacher_status || '');
    }
  }, [open, initialValues]);

  const canSubmit = fullName.trim() && email.trim() && role;
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{initialValues ? 'Edit Staff' : 'Add Staff'}</DialogTitle>
          <DialogDescription>{initialValues ? 'Update staff details' : 'Create a new staff member'}</DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 border border-red-200 bg-red-50 rounded-lg mb-4 text-sm text-red-800">{error}</div>
        )}
        {successMessage && (
          <div className="p-3 border border-green-200 bg-green-50 rounded-lg mb-4">
            <span className="text-sm text-green-800">{successMessage}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g., John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <Select value={role} onValueChange={(v) => setRole(v as CreateStaffData['role'])}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Teacher">Teacher</SelectItem>
                <SelectItem value="Learning Advisor">Learning Advisor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <Input value={phone || ''} onChange={(e) => setPhone(e.target.value)} placeholder="e.g., 0123-456-789" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nickname</label>
            <Input value={nickname || ''} onChange={(e) => setNickname(e.target.value)} placeholder="Nickname" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Philosophy</label>
            <Input value={philosophy || ''} onChange={(e) => setPhilosophy(e.target.value)} placeholder="Short bio/philosophy" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Achievements</label>
            <Input value={achievements || ''} onChange={(e) => setAchievements(e.target.value)} placeholder="Comma separated achievements" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Teacher Status</label>
            <Input value={teacherStatus || ''} onChange={(e) => setTeacherStatus(e.target.value)} placeholder="e.g., Available" />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
          <Button
            onClick={async () => {
              if (!canSubmit) return;
              const ok = await onSubmit({
                full_name: fullName.trim(),
                email: email.trim(),
                role,
                phone_number: phone || null,
                nickname: nickname || null,
                philosophy: philosophy || null,
                achievements: achievements || null,
                teacher_status: teacherStatus || null,
              });
              if (ok) {
                setSuccessMessage(initialValues ? 'Staff updated successfully!' : 'Staff created successfully!');
                setTimeout(() => {
                  setSuccessMessage(null);
                  onOpenChange(false);
                }, 1200);
              }
            }}
            disabled={!canSubmit || !!isSubmitting}
          >
            {isSubmitting ? 'Saving...' : (initialValues ? 'Save' : 'Create')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StaffForm;


