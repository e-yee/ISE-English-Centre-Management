import React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import CopyIcon from '@/assets/class/copy.svg';

interface StudentInfoProps {
  isExpanded: boolean;
  className?: string;
  studentData?: {
    email?: string;
    phone?: string;
    dateOfBirth?: string;
    presence?: string;
    note?: string;
  };
}

const StudentInfo: React.FC<StudentInfoProps> = ({
  isExpanded,
  className,
  studentData = {}
}) => {
  const handleCopy = (text: string | undefined) => {
    if (text && text.trim()) {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div
      className={cn(
        // Base styling matching Figma design
        'bg-white border-0 border-b-2 border-l-2 border-r-2 border-[#D9D9D9]',
        'rounded-b-[20px] shadow-[5px_4px_4px_0px_rgba(0,0,0,0.25),inset_5px_4px_4px_0px_rgba(0,0,0,0.25)]',
        'w-full transition-all duration-300 ease-in-out overflow-hidden',
        // Animation classes
        isExpanded ? 'max-h-[400px] opacity-100 py-6 px-6' : 'max-h-0 opacity-0 py-0 px-6',
        className
      )}
    >
      {/* Main Content Grid */}
      <div className="grid grid-cols-2 gap-8">
        {/* Left Column - Email, Phone, Date of Birth */}
        <div className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-[25px] font-normal text-black font-roboto leading-[1.6em]">
              Email:
            </label>
            <div className="relative flex items-center gap-3">
              <Input
                value={studentData.email || ''}
                readOnly
                className="flex-1 h-12 rounded-[10px] border border-black bg-white px-4 text-[20px] font-normal text-[rgba(0,0,0,0.65)] font-roboto leading-[2em] text-center"
                placeholder="No email provided"
              />
              <button
                onClick={() => handleCopy(studentData.email)}
                className="flex-shrink-0 w-6 h-6 hover:scale-110 transition-transform"
                aria-label="Copy email"
              >
                <img
                  src={CopyIcon}
                  alt="Copy"
                  className="w-full h-full object-contain"
                />
              </button>
            </div>
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <label className="text-[25px] font-normal text-black font-roboto leading-[1.6em]">
              Phone:
            </label>
            <div className="relative flex items-center gap-3">
              <Input
                value={studentData.phone || ''}
                readOnly
                className="flex-1 h-12 rounded-[10px] border border-black bg-white px-4 text-[20px] font-normal text-[rgba(0,0,0,0.65)] font-roboto leading-[2em] text-center"
                placeholder="No phone provided"
              />
              <button
                onClick={() => handleCopy(studentData.phone)}
                className="flex-shrink-0 w-6 h-6 hover:scale-110 transition-transform"
                aria-label="Copy phone"
              >
                <img
                  src={CopyIcon}
                  alt="Copy"
                  className="w-full h-full object-contain"
                />
              </button>
            </div>
          </div>

          {/* Date of Birth Field */}
          <div className="space-y-2">
            <label className="text-[25px] font-normal text-black font-roboto leading-[1.6em]">
              Date of Birth:
            </label>
            <Input
              value={studentData.dateOfBirth || ''}
              readOnly
              className="w-full h-12 rounded-[10px] border border-black bg-white px-4 text-[20px] font-normal text-[rgba(0,0,0,0.65)] font-roboto leading-[2em] text-center"
              placeholder="No date of birth provided"
            />
          </div>
        </div>

        {/* Right Column - Presence, Note */}
        <div className="space-y-6">
          {/* Presence Field */}
          <div className="space-y-2">
            <label className="text-[25px] font-normal text-black font-roboto leading-[1.6em]">
              Presence:
            </label>
            <Input
              value={studentData.presence || ''}
              readOnly
              className="w-full h-12 rounded-[10px] border border-black bg-white px-4 text-[20px] font-normal text-[rgba(0,0,0,0.65)] font-roboto leading-[2em] text-center"
              placeholder="No presence data"
            />
          </div>

          {/* Note Field */}
          <div className="space-y-2">
            <label className="text-[25px] font-normal text-black font-roboto leading-[1.6em]">
              Note:
            </label>
            <div className="relative flex items-start gap-3">
              <textarea
                value={studentData.note || ''}
                readOnly
                className="flex-1 min-h-[120px] rounded-[10px] border border-black bg-white px-4 py-3 text-[20px] font-normal text-[rgba(0,0,0,0.65)] font-roboto leading-[2em] resize-none focus:outline-none focus:border-black focus:ring-0"
                placeholder="No note provided"
              />
              <button
                onClick={() => handleCopy(studentData.note)}
                className="flex-shrink-0 w-6 h-6 hover:scale-110 transition-transform mt-3"
                aria-label="Copy note"
              >
                <img
                  src={CopyIcon}
                  alt="Copy"
                  className="w-full h-full object-contain"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentInfo;
