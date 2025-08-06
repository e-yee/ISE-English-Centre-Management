import React from 'react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';
import type { StudentData } from '@/mockData/studentListMock';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import CopyIcon from '@/assets/class/copy.svg';

interface StudentTabProps {
  studentData: StudentData;
  className?: string;
}

const StudentTab: React.FC<StudentTabProps> = ({ studentData, className }) => {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";
  const { index, name, studentId, contact, dateOfBirth } = studentData;

  const handleCopy = (text: string | undefined) => {
    if (text && text.trim()) {
      navigator.clipboard.writeText(text);
    }
  };

  // Format date of birth for display
  const formatDateOfBirth = (dateString: string | undefined) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
    } catch {
      return dateString; // Return as-is if parsing fails
    }
  };

  return (
    <RevealOnScroll
      variant="slide-down"
      delay={100}
      threshold={0.2}
      className="w-full"
    >
      <Card className={cn(
        "student-tab-container bg-white border border-[rgba(0,0,0,0.2)] shadow-[5px_4px_4px_0px_rgba(0,0,0,0.25)] transition-all duration-300 ease-in-out",
        "w-full min-h-[120px] rounded-[15px]", // Reduced height to match Class component size
        className
      )}>
        <CardContent className={cn(
          "transition-all duration-300 ease-in-out",
          isExpanded ? "p-3" : "p-2" // Further reduced padding for more compact size
        )}>
          {/* Student Name and ID Section - Reduced sizes */}
          <div className="flex items-start mb-3">
            {/* Index Number - Reduced size */}
            <span className="w-[20px] flex-shrink-0 pr-1 text-right text-[24px] font-semibold text-[rgba(0,0,0,0.75)] leading-[1.2em] font-comfortaa">
              {index}.
            </span>

            {/* Name and ID Column - Vertically aligned with reduced sizes */}
            <div className="flex flex-col justify-center">
              {/* Student Name - Reduced from 40px to 24px */}
              <div className="text-[24px] font-semibold text-[rgba(0,0,0,0.75)] leading-[1.2em] font-comfortaa">
                {name}
              </div>

              {/* Student ID - Reduced from 20px to 14px */}
              <div className="text-[14px] font-medium text-[rgba(0,0,0,0.9)] leading-[1.2em] font-comfortaa">
                ID: {studentId}
              </div>
            </div>
          </div>

          {/* Student Information Grid - 2x2 layout with better spacing */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            {/* Row 1 - Contact and DoB */}
            <div className="space-y-1">
              <label className="text-[12px] font-normal text-[rgba(0,0,0,0.5)] font-comfortaa leading-[1.2em]">
                Contact:
              </label>
              <div className="relative flex items-center gap-1">
                <Input
                  value={contact || ''}
                  readOnly
                  className="flex-1 h-7 rounded-[3px] border border-[rgba(0,0,0,0.45)] bg-[rgba(217,217,217,0.3)] px-2 text-[12px] font-normal text-[rgba(0,0,0,0.65)] font-comfortaa text-center"
                  placeholder=""
                />
                <button
                  onClick={() => handleCopy(contact)}
                  className="flex-shrink-0 w-3 h-3 hover:scale-110 transition-transform"
                  aria-label="Copy contact"
                >
                  <img
                    src={CopyIcon}
                    alt="Copy"
                    className="w-full h-full object-contain opacity-50"
                  />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-normal text-[rgba(0,0,0,0.5)] font-comfortaa leading-[1.2em]">
                DoB:
              </label>
              <div className="relative flex items-center gap-1">
                <Input
                  value={formatDateOfBirth(dateOfBirth)}
                  readOnly
                  className="flex-1 h-7 rounded-[3px] border border-[rgba(0,0,0,0.45)] bg-[rgba(217,217,217,0.3)] px-2 text-[12px] font-normal text-[rgba(0,0,0,0.65)] font-comfortaa text-center"
                  placeholder=""
                />
                <button
                  onClick={() => handleCopy(formatDateOfBirth(dateOfBirth))}
                  className="flex-shrink-0 w-3 h-3 hover:scale-110 transition-transform"
                  aria-label="Copy date of birth"
                >
                  <img
                    src={CopyIcon}
                    alt="Copy"
                    className="w-full h-full object-contain opacity-50"
                  />
                </button>
              </div>
            </div>

            {/* Row 2 - Presence spans both columns for better balance */}
            <div className="col-span-2 space-y-1">
              <label className="text-[12px] font-normal text-[rgba(0,0,0,0.5)] font-comfortaa leading-[1.2em]">
                Presence:
              </label>
              <div className="relative flex items-center gap-1">
                <Input
                  value="Present" // Default value since backend doesn't provide this
                  readOnly
                  className="flex-1 h-7 rounded-[3px] border border-[rgba(0,0,0,0.45)] bg-[rgba(217,217,217,0.3)] px-2 text-[12px] font-normal text-[rgba(0,0,0,0.65)] font-comfortaa text-center"
                  placeholder=""
                />
                <button
                  onClick={() => handleCopy("Present")}
                  className="flex-shrink-0 w-3 h-3 hover:scale-110 transition-transform"
                  aria-label="Copy presence"
                >
                  <img
                    src={CopyIcon}
                    alt="Copy"
                    className="w-full h-full object-contain opacity-50"
                  />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </RevealOnScroll>
  );
};

export default StudentTab;
