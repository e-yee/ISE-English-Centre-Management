import React, { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';
import type { StudentData } from '@/mockData/studentListMock';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import CopyIcon from '@/assets/class/copy.svg';

const TickIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

interface StudentTabProps {
  studentData: StudentData;
  className?: string;
}

const StudentTab: React.FC<StudentTabProps> = ({ studentData, className }) => {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";
  const { index, name, studentId, contact, dateOfBirth } = studentData;

  const [copiedContact, setCopiedContact] = useState(false);
  const [copiedDob, setCopiedDob] = useState(false);
  const [copiedPresence, setCopiedPresence] = useState(false);

  const copyToClipboard = useCallback(async (text: string | undefined) => {
    if (!text || !text.trim()) return false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {}
    try {
      const el = document.createElement('textarea');
      el.value = text;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.focus();
      el.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(el);
      return ok;
    } catch {
      return false;
    }
  }, []);

  const handleCopyContact = useCallback(async () => {
    const ok = await copyToClipboard(contact);
    if (!ok) return;
    setCopiedContact(true);
    setTimeout(() => setCopiedContact(false), 1200);
  }, [contact, copyToClipboard]);

  const handleCopyDob = useCallback(async () => {
    const ok = await copyToClipboard(formatDateOfBirth(dateOfBirth));
    if (!ok) return;
    setCopiedDob(true);
    setTimeout(() => setCopiedDob(false), 1200);
  }, [dateOfBirth, copyToClipboard]);

  const handleCopyPresence = useCallback(async () => {
    const ok = await copyToClipboard('Present');
    if (!ok) return;
    setCopiedPresence(true);
    setTimeout(() => setCopiedPresence(false), 1200);
  }, [copyToClipboard]);

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
        "student-tab-container bg-white border border-[rgba(0,0,0,0.2)] shadow-[5px_4px_4px_0px_rgba(0,0,0,0.15)] transition-all duration-200 ease-in-out",
        "w-full min-h-[120px] rounded-[15px]",
        "hover:shadow-[6px_6px_10px_0px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 hover:bg-gray-50",
        className
      )}>
        <CardContent className={cn(
          "transition-all duration-300 ease-in-out",
          isExpanded ? "p-3" : "p-2" // Further reduced padding for more compact size
        )}>
          {/* Student Name and ID Section - Reduced sizes */}
          <div className="flex flex-row items-start mb-3">
            {/* Index Number - Reduced size */}
            <span className="w-fit pr-1 text-left text-[24px] font-semibold text-[rgba(0,0,0,0.75)] leading-[1.2em] font-comfortaa">
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
              <label className="text-[12px] font-semibold text-black font-comfortaa leading-[1.2em]">
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
                  onClick={handleCopyContact}
                  className="cursor-pointer flex-shrink-0 w-3 h-3 hover:scale-110 transition-transform"
                  aria-label="Copy contact"
                  title={copiedContact ? 'Copied!' : 'Copy'}
                >
                  {copiedContact ? (
                    <TickIcon className="w-full h-full text-green-600 opacity-80" />
                  ) : (
                    <img
                      src={CopyIcon}
                      alt="Copy"
                      className="w-full h-full object-contain opacity-70"
                    />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-semibold text-black font-comfortaa leading-[1.2em]">
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
                  onClick={handleCopyDob}
                  className="cursor-pointer flex-shrink-0 w-3 h-3 hover:scale-110 transition-transform"
                  aria-label="Copy date of birth"
                  title={copiedDob ? 'Copied!' : 'Copy'}
                >
                  {copiedDob ? (
                    <TickIcon className="w-full h-full text-green-600 opacity-80" />
                  ) : (
                    <img
                      src={CopyIcon}
                      alt="Copy"
                      className="w-full h-full object-contain opacity-70"
                    />
                  )}
                </button>
              </div>
            </div>

            {/* Row 2 - Presence spans both columns for better balance */}
            <div className="col-span-2 space-y-1">
              <label className="text-[12px] font-semibold text-black font-comfortaa leading-[1.2em]">
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
                  onClick={handleCopyPresence}
                  className="cursor-pointer flex-shrink-0 w-3 h-3 hover:scale-110 transition-transform"
                  aria-label="Copy presence"
                  title={copiedPresence ? 'Copied!' : 'Copy'}
                >
                  {copiedPresence ? (
                    <TickIcon className="w-full h-full text-green-600 opacity-80" />
                  ) : (
                    <img
                      src={CopyIcon}
                      alt="Copy"
                      className="w-full h-full object-contain opacity-70"
                    />
                  )}
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
