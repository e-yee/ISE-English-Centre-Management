import React from 'react';
import { cn } from '@/lib/utils';
import AbsenceRequestForm from '@/components/absent-request/AbsenceRequestForm';
import LeaveRequestList from '@/components/absent-request/LeaveRequestList';
import { leaveRequestDisplayMock } from '@/mockData/leaveRequestMock';
import absentRequestIcon from '@/assets/sidebar/absent-request.svg';

interface AbsentRequestPageProps {
  className?: string;
}

const AbsentRequestPage: React.FC<AbsentRequestPageProps> = ({ className }) => {
  // Status indicator component
  const StatusIndicator = ({ status }: { status: 'pending' | 'approved' | 'rejected' }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'pending':
          return 'bg-yellow-400 text-yellow-900';
        case 'approved':
          return 'bg-green-500 text-white';
        case 'rejected':
          return 'bg-red-500 text-white';
        default:
          return 'bg-gray-400 text-gray-900';
      }
    };

    const getStatusText = (status: string) => {
      switch (status) {
        case 'pending':
          return 'PENDING';
        case 'approved':
          return 'APPROVED';
        case 'rejected':
          return 'REJECTED';
        default:
          return 'UNKNOWN';
      }
    };

    return (
      <div className={cn(
        'px-4 py-2 rounded-full font-comfortaa font-bold text-sm',
        getStatusColor(status)
      )}>
        {getStatusText(status)}
      </div>
    );
  };

  return (
    <div className={cn('h-full overflow-y-auto flex flex-col items-center pt-8', className)}>
      <div className="w-full max-w-4xl">
        {/* Title and Icon Section - positioned on the left side */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
              <img 
                src={absentRequestIcon} 
                alt="Absence Request Icon" 
                className="w-12 h-12"
                style={{ filter: 'brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(246deg) brightness(104%) contrast(97%)' }}
              />
            </div>
            <h1 className="text-5xl font-bold font-comfortaa" style={{ color: '#945CD8' }}>
              Absence Request
            </h1>
          </div>
          <StatusIndicator status="rejected" />
        </div>
        
        <div className="space-y-8">
          <AbsenceRequestForm status="rejected" />
          <LeaveRequestList requests={leaveRequestDisplayMock} />
        </div>
      </div>
    </div>
  );
};

export default AbsentRequestPage; 