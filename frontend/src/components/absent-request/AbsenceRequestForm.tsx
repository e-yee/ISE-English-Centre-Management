import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import calendarIcon from '@/assets/class/calendar.svg';
import { format } from 'date-fns';
import { useCreateLeaveRequest } from '@/hooks/entities/useLeaveRequest';
import type { LeaveRequest } from '@/types/leaveRequest';
import { getUserRole } from '@/lib/utils';
import employeeService, { type Employee } from '@/services/entities/employeeService';
import { getEmployeeIdFromToken } from '@/lib/utils';

interface AbsenceRequestFormProps {
  className?: string;
  status?: 'pending' | 'approved' | 'rejected';
  isPending?: boolean;
  pendingRequest?: LeaveRequest;
  requiresSubstitute?: boolean;
}

const AbsenceRequestForm: React.FC<AbsenceRequestFormProps> = ({ className, status, isPending, pendingRequest, requiresSubstitute }) => {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [absenceType, setAbsenceType] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [substituteId, setSubstituteId] = useState<string>('');
  const [substituteName, setSubstituteName] = useState<string>('');

  const [teachers, setTeachers] = useState<Employee[]>([]);
  const [teachersLoading, setTeachersLoading] = useState<boolean>(false);
  const [teachersError, setTeachersError] = useState<string | null>(null);
  const [teachersLoaded, setTeachersLoaded] = useState<boolean>(false);

  const { createRequest, isLoading, error, success, clearMessages } = useCreateLeaveRequest();

  const isDisabled = isPending || status === 'pending';
  const role = getUserRole();
  const needsSubstitute = requiresSubstitute ?? role === 'Teacher';

  // Parse pending request data and populate form fields
  React.useEffect(() => {
    if (pendingRequest && isPending) {
      // Parse the reason field to extract absence type and notes
      const reasonParts = pendingRequest.reason.split(': ');
      const parsedAbsenceType = reasonParts[0] || '';
      const parsedNotes = reasonParts.slice(1).join(': ') || '';
      
      setStartDate(new Date(pendingRequest.start_date));
      setEndDate(new Date(pendingRequest.end_date));
      setAbsenceType(parsedAbsenceType);
      setNotes(parsedNotes);
      if (pendingRequest.substitute_id) setSubstituteId(pendingRequest.substitute_id);
    }
  }, [pendingRequest, isPending]);

  const clearForm = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setAbsenceType('');
    setNotes('');
    setSubstituteId('');
    setSubstituteName('');
    clearMessages();
  };

  const handleSubmit = async () => {
    if (!startDate || !endDate || !absenceType || !notes) return;
    if (needsSubstitute && !substituteId) return;

    const baseData = {
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      reason: `${absenceType}: ${notes}`,
    } as const;

    const requestData: any = { ...baseData };
    if (needsSubstitute) requestData.substitute_id = substituteId;
    else if (role === 'Learning Advisor' && substituteId) requestData.substitute_id = substituteId;

    const result = await createRequest(requestData);
    if (result) {
      clearForm();
    }
  };

  const fetchAvailableTeachers = async () => {
    if (isDisabled || !needsSubstitute) return;
    setTeachersLoading(true);
    setTeachersError(null);
    try {
      let list: Employee[] = [];
      try {
        list = await employeeService.getAvailableTeachers();
      } catch (_err) {
        // ignore and fallback below
      }
      if (!list || list.length === 0) {
        try {
          const all = await employeeService.getAllEmployees();
          list = (all || []).filter(
            (e) => (e.role === 'Teacher') && (e.teacher_status?.toLowerCase() === 'available')
          );
        } catch (err) {
          setTeachersError('Failed to load available teachers');
          setTeachers([]);
          return;
        }
      }
      const myId = getEmployeeIdFromToken();
      const normalized = (list || [])
        .map((e) => ({ ...e, id: e.id ?? e.email }))
        .filter((e) => !myId || e.id !== myId);
      setTeachers(normalized);
    } finally {
      setTeachersLoading(false);
      setTeachersLoaded(true);
    }
  };

  return (
    <div className={cn('w-full max-w-4xl p-8 space-y-8 bg-white rounded-lg shadow-md', className)}>
      {/* Pending Request Indicator */}
      {isPending && pendingRequest && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <p className="font-comfortaa font-semibold text-yellow-800">
              Pending Request - Form displays your submitted request (read-only)
            </p>
          </div>
        </div>
      )}
      
      <div className="space-y-6">
        <div>
          <Label htmlFor="absence-type" className="font-comfortaa font-bold text-lg">Type of Absence</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className={cn(
                  "w-full justify-between mt-1 font-comfortaa font-bold text-xl",
                  isDisabled && "bg-gray-100 text-gray-500 cursor-not-allowed"
                )}
                disabled={isDisabled}
              >
                {absenceType || "Select a reason..."}
                <span className="ml-2">▼</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
              <DropdownMenuContent className="w-full" align="start">
                <DropdownMenuItem 
                  className="font-comfortaa"
                  onClick={() => setAbsenceType('Sick Leave')}
                >
                  Sick Leave
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="font-comfortaa"
                  onClick={() => setAbsenceType('Vacation')}
                >
                  Vacation
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="font-comfortaa"
                  onClick={() => setAbsenceType('Personal Day')}
                >
                  Personal Day
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="font-comfortaa"
                  onClick={() => setAbsenceType('Other')}
                >
                  Other
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenu>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Label htmlFor="start-date" className="font-comfortaa font-bold text-lg">Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <div className="relative mt-1">
                  <Input
                    id="start-date"
                    value={startDate ? format(startDate, 'dd/MM/yyyy') : ''}
                    placeholder="dd/mm/yyyy"
                    readOnly
                    className={cn(
                      "font-comfortaa font-medium text-xl",
                      isDisabled && "bg-gray-100 text-gray-500 cursor-not-allowed"
                    )}
                    disabled={isDisabled}
                  />
                  <img src={calendarIcon} alt="Calendar Icon" className="absolute w-5 h-5 top-1/2 right-3 transform -translate-y-1/2 cursor-pointer" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus disabled={isDisabled} />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="end-date" className="font-comfortaa font-bold text-lg">End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <div className="relative mt-1">
                  <Input
                    id="end-date"
                    value={endDate ? format(endDate, 'dd/MM/yyyy') : ''}
                    placeholder="dd/mm/yyyy"
                    readOnly
                    className={cn(
                      "font-comfortaa font-medium text-xl",
                      isDisabled && "bg-gray-100 text-gray-500 cursor-not-allowed"
                    )}
                    disabled={isDisabled}
                  />
                  <img src={calendarIcon} alt="Calendar Icon" className="absolute w-5 h-5 top-1/2 right-3 transform -translate-y-1/2 cursor-pointer" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus disabled={isDisabled} />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {role === 'Learning Advisor' && (
          <div>
            <Label htmlFor="la-substitute" className="font-comfortaa font-bold text-lg">Substitute Employee ID (optional)</Label>
            <Input
              id="la-substitute"
              placeholder="e.g., EM002"
              className={cn(
                'mt-1 font-comfortaa font-medium text-lg',
                isDisabled && 'bg-gray-100 text-gray-500 cursor-not-allowed'
              )}
              disabled={isDisabled}
              value={substituteId}
              onChange={(e) => setSubstituteId(e.target.value)}
            />
          </div>
        )}

        {needsSubstitute && (
          <div>
            <Label htmlFor="substitute" className="font-comfortaa font-bold text-lg">Substitute Teacher</Label>
            <DropdownMenu onOpenChange={(open) => { if (open) fetchAvailableTeachers(); }}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-between mt-1 font-comfortaa font-medium text-xl",
                    isDisabled && "bg-gray-100 text-gray-500 cursor-not-allowed"
                  )}
                  disabled={isDisabled}
                >
                  {substituteId
                    ? `${substituteId}${substituteName ? ` - ${substituteName}` : ''}`
                    : 'Select substitute teacher...'}
                  <span className="ml-2">▼</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuPortal>
                <DropdownMenuContent className="w-full" align="start">
                  {teachersLoading && (
                    <DropdownMenuItem disabled className="font-comfortaa italic">Loading...</DropdownMenuItem>
                  )}
                  {!teachersLoading && teachersError && (
                    <DropdownMenuItem disabled className="font-comfortaa text-red-500">{teachersError}</DropdownMenuItem>
                  )}
                  {teachersLoaded && !teachersLoading && !teachersError && teachers.length === 0 && (
                    <DropdownMenuItem disabled className="font-comfortaa">No available teachers</DropdownMenuItem>
                  )}
                  {!teachersLoading && !teachersError && teachers.map((t) => (
                    <DropdownMenuItem
                      key={(t.id as string) ?? t.email}
                      className="font-comfortaa"
                      onClick={() => {
                        const displayName = t.full_name || t.name || t.email;
                        if (!t.id) {
                          console.warn('Selected teacher has no id, using empty substituteId', t);
                        }
                        setSubstituteId((t.id as string) || '');
                        setSubstituteName(displayName);
                      }}
                    >
                      {(t.id as string) || 'N/A'} - {(t.full_name || t.name || t.email)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenuPortal>
            </DropdownMenu>
          </div>
        )}

        <div>
          <Label htmlFor="notes" className="font-comfortaa font-bold text-lg">{needsSubstitute ? 'Substitution Plan & Note' : 'Reason Details'}</Label>
          <Textarea
            id="notes"
            placeholder={needsSubstitute ? 'e.g., Ms. Jane Doe will cover my classes. All materials are on shared drive' : 'e.g., Doctor appointment, family matter'}
            className={cn(
              "mt-1 font-comfortaa font-medium text-lg",
              isDisabled && "bg-gray-100 text-gray-500 cursor-not-allowed"
            )}
            disabled={isDisabled}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="text-red-500 font-comfortaa text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="text-green-500 font-comfortaa text-sm">
            {success}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        {!isPending && (
          <Button 
            variant="outline" 
            onClick={clearForm}
            className="font-comfortaa font-semibold text-lg"
          >
            CLEAR FORM
          </Button>
        )}
        <Button 
          style={{ backgroundColor: '#945CD8', color: 'white' }} 
          className="font-comfortaa font-semibold text-lg"
          disabled={isDisabled || isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? 'SUBMITTING...' : isPending ? 'REQUEST PENDING' : 'SUBMIT'}
        </Button>
      </div>
    </div>
  );
};

export default AbsenceRequestForm; 