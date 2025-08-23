import React from 'react';
import { cn } from '@/lib/utils';
import type { LeaveRequestDisplay } from '@/types/leaveRequest';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';

interface LeaveRequestListProps {
  requests: LeaveRequestDisplay[];
  className?: string;
}

const LeaveRequestList: React.FC<LeaveRequestListProps> = ({ requests, className }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-500 text-white';
      case 'Not Approved':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-400 text-gray-900';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'APPROVED';
      case 'Not Approved':
        return 'NOT APPROVED';
      default:
        return 'UNKNOWN';
    }
  };

  if (requests.length === 0) {
    return (
      <div className={cn('text-center py-12', className)}>
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-gray-500 font-comfortaa">
            <p className="text-xl mb-2">No leave requests found</p>
            <p className="text-sm">Your past leave requests will appear here</p>
          </div>
        </div>
      </div>
    );
  }

  const sortedRequests = React.useMemo(() => {
    return [...requests].sort((a, b) => b.createdDate.getTime() - a.createdDate.getTime());
  }, [requests]);

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center space-x-4 mb-6">
        <h2 className="text-3xl font-bold font-comfortaa" style={{ color: '#945CD8' }}>
          Previous Leave Requests
        </h2>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>
      
      <div className="space-y-4">
        {sortedRequests.map((request) => (
          <Card key={`${request.id}-${request.createdDate.getTime()}`} className="shadow-md hover:shadow-lg transition-shadow duration-200 border-0 bg-white">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <h3 className="font-comfortaa font-semibold text-xl text-gray-800 flex-1">
                      {request.reason}
                    </h3>
                    <div className={cn(
                      'px-4 py-2 rounded-full text-sm font-comfortaa font-bold',
                      getStatusColor(request.status)
                    )}>
                      {getStatusText(request.status)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs font-comfortaa font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Date Range
                      </div>
                      <div className="font-comfortaa text-sm text-gray-800">
                        {format(request.startDate, 'MMM dd, yyyy')} - {format(request.endDate, 'MMM dd, yyyy')}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs font-comfortaa font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Substitute
                      </div>
                      <div className="font-comfortaa text-sm text-gray-800">
                        {request.substituteName}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs font-comfortaa font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Requested
                      </div>
                      <div className="font-comfortaa text-sm text-gray-800">
                        {format(request.createdDate, 'MMM dd, yyyy')}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs font-comfortaa font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Request ID
                      </div>
                      <div className="font-comfortaa text-sm text-gray-800 font-mono">
                        {request.id}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LeaveRequestList; 