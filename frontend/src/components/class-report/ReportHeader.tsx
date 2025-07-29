import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { ReportHeaderProps } from '@/mockData/classReportMock';

const ReportHeader: React.FC<ReportHeaderProps> = ({
  className,
  classDisplayName,
  studentCount,
  onExport
}) => {

  return (
    <div className={cn(
      "flex items-center justify-between w-full p-6 bg-white rounded-[15px] border border-black/20 shadow-[5px_4px_4px_0px_rgba(0,0,0,0.25)]",
      className
    )}>
      {/* Left Section - Report Badge and Class Name */}
      <div className="flex items-center gap-4">
        {/* Report Badge */}
        <div className="bg-blue-500 text-white px-4 py-2 rounded-[8px] font-semibold text-[16px] font-comfortaa">
          Report
        </div>

        {/* Class Name */}
        <div className="text-[32px] font-semibold text-black leading-[1.4em] font-comfortaa">
          {classDisplayName}
        </div>
      </div>

      {/* Right Section - Export Button and Student Count */}
      <div className="flex items-center gap-6">
        {/* Export Button */}
        <Button
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-[8px] font-semibold text-[16px] font-comfortaa transition-colors duration-200 flex items-center gap-2"
          onClick={onExport}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7,10 12,15 17,10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export
        </Button>

        {/* Student Count */}
        <div className="flex items-center gap-2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6 text-black"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="m22 21-2-2" />
            <path d="M16 16h6" />
          </svg>
          <span className="text-[20px] font-semibold text-black leading-[1.4em] font-comfortaa">
            {studentCount} students
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReportHeader; 