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

interface AbsenceRequestFormProps {
  className?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

const AbsenceRequestForm: React.FC<AbsenceRequestFormProps> = ({ className, status}) => {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [absenceType, setAbsenceType] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const isDisabled = status === 'pending';
  const showClearButton = status === 'approved' || status === 'rejected';

  const clearForm = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setAbsenceType('');
    setNotes('');
  };

  return (
    <div className={cn('w-full max-w-4xl p-8 space-y-8 bg-white rounded-lg shadow-md', className)}>
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

        <div>
          <Label htmlFor="notes" className="font-comfortaa font-bold text-lg">Substitution Plan & Note</Label>
          <Textarea
            id="notes"
            placeholder="e.g., Ms. Jane Doe will cover my classes. All materials are on shared drive"
            className={cn(
              "mt-1 font-comfortaa font-medium text-lg",
              isDisabled && "bg-gray-100 text-gray-500 cursor-not-allowed"
            )}
            disabled={isDisabled}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        {showClearButton && (
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
          disabled={isDisabled}
        >
          SUBMIT
        </Button>
      </div>
    </div>
  );
};

export default AbsenceRequestForm; 