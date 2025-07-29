import React from 'react';
import AttendancePage from '@/pages/attendance/AttendancePage';

interface AttendancePageDemoProps {
  className?: string;
}

const AttendancePageDemo: React.FC<AttendancePageDemoProps> = ({ className }) => {
  return <AttendancePage className={className} />;
};

export default AttendancePageDemo; 