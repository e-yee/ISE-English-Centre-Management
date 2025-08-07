import React from 'react';
import { cn } from '@/lib/utils';
import AbsenceRequestForm from '@/components/absent-request/AbsenceRequestForm';
import LeaveRequestList from '@/components/absent-request/LeaveRequestList';
import { useLeaveRequests, useApproveLeaveRequest } from '@/hooks/entities/useLeaveRequest';
import { useEmployees } from '@/hooks/entities/useEmployees';
import absentRequestIcon from '@/assets/sidebar/absent-request.svg';
import { getUserRole } from '@/lib/utils';
import type { LeaveRequest, LeaveRequestDisplay } from '@/types/leaveRequest';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface AbsentRequestPageProps {
  className?: string;
}

const AbsentRequestPage: React.FC<AbsentRequestPageProps> = ({ className }) => {
  const { data: requests, isLoading, error } = useLeaveRequests();
  const { approveRequest, isLoading: isApproving, error: approvalError, success: approvalSuccess } = useApproveLeaveRequest();
  const { data: employees, isLoading: employeesLoading } = useEmployees();
  const userRole = getUserRole();

  // Helper function to get employee name by ID
  const getEmployeeNameById = (employeeId: string): string => {
    if (!employees || employeesLoading) {
      return `Employee-${employeeId}`;
    }
    
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? `${employee.full_name}-${employeeId}` : `Employee-${employeeId}`;
  };

  // Transform backend data to frontend display format
  const transformToDisplayFormat = (requests: LeaveRequest[]): LeaveRequestDisplay[] => {
    return requests.map(req => ({
      id: req.employee_id, // Changed to use employee_id instead of req.id
      employeeName: getEmployeeNameById(req.employee_id),
      substituteName: getEmployeeNameById(req.substitute_id),
      startDate: new Date(req.start_date),
      endDate: new Date(req.end_date),
      reason: req.reason,
      status: req.status,
      createdDate: new Date(req.created_date)
    }));
  };

  // Status indicator component
  const StatusIndicator = ({ status }: { status?: 'Approved' | 'Not Approved' | 'Pending' }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'Approved':
          return 'bg-green-500 text-white';
        case 'Not Approved':
          return 'bg-red-500 text-white';
        case 'Pending':
          return 'bg-yellow-400 text-yellow-900';
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
        case 'Pending':
          return 'PENDING';
        default:
          return 'UNKNOWN';
      }
    };

    if (!status) return null;
    
    return (
      <div className={cn(
        'px-4 py-2 rounded-full font-comfortaa font-bold text-sm',
        getStatusColor(status)
      )}>
        {getStatusText(status)}
      </div>
    );
  };

  // Manager Approval Component
  const ManagerApprovalInterface = ({ pendingRequests }: { pendingRequests: LeaveRequest[] }) => {
    const handleApprove = async (id: string, approved: boolean) => {
      const status = approved ? 'Approved' : 'Not Approved';
      await approveRequest(id, status);
    };

    if (pendingRequests.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-500 font-comfortaa">
            <p className="text-xl mb-2">No pending requests</p>
            <p className="text-sm">All leave requests have been processed</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4 mb-6">
          <h2 className="text-3xl font-bold font-comfortaa" style={{ color: '#945CD8' }}>
            Pending Approval Requests
          </h2>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {approvalError && (
          <div className="text-red-500 font-comfortaa text-sm p-4 bg-red-50 rounded-lg">
            {approvalError}
          </div>
        )}

        {approvalSuccess && (
          <div className="text-green-500 font-comfortaa text-sm p-4 bg-green-50 rounded-lg">
            {approvalSuccess}
          </div>
        )}

        <div className="space-y-4">
          {pendingRequests.map((request) => (
            <Card key={request.id} className="shadow-md hover:shadow-lg transition-shadow duration-200 border-0 bg-white">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <h3 className="font-comfortaa font-semibold text-xl text-gray-800 flex-1">
                        {request.reason}
                      </h3>
                      <div className="px-4 py-2 rounded-full text-sm font-comfortaa font-bold bg-yellow-400 text-yellow-900">
                        PENDING
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs font-comfortaa font-medium text-gray-500 uppercase tracking-wide mb-1">
                          Date Range
                        </div>
                        <div className="font-comfortaa text-sm text-gray-800">
                          {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs font-comfortaa font-medium text-gray-500 uppercase tracking-wide mb-1">
                          Employee ID
                        </div>
                        <div className="font-comfortaa text-sm text-gray-800">
                          {request.employee_id}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs font-comfortaa font-medium text-gray-500 uppercase tracking-wide mb-1">
                          Substitute ID
                        </div>
                        <div className="font-comfortaa text-sm text-gray-800">
                          {request.substitute_id}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs font-comfortaa font-medium text-gray-500 uppercase tracking-wide mb-1">
                          Requested by ID
                        </div>
                        <div className="font-comfortaa text-sm text-gray-800 font-mono">
                          {request.id}
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <Button
                        onClick={() => handleApprove(request.id, true)}
                        disabled={isApproving}
                        className="bg-green-500 hover:bg-green-600 text-white font-comfortaa font-semibold"
                      >
                        {isApproving ? 'APPROVING...' : 'APPROVE'}
                      </Button>
                      <Button
                        onClick={() => handleApprove(request.id, false)}
                        disabled={isApproving}
                        className="bg-red-500 hover:bg-red-600 text-white font-comfortaa font-semibold"
                      >
                        {isApproving ? 'REJECTING...' : 'REJECT'}
                      </Button>
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

  // Loading state
  if (isLoading) {
    return (
      <div className={cn('h-full overflow-y-auto flex flex-col items-center pt-8', className)}>
        <div className="w-full max-w-4xl">
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
          </div>
          <div className="text-center py-12">
            <div className="text-gray-500 font-comfortaa">
              <p className="text-xl mb-2">Loading leave requests...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={cn('h-full overflow-y-auto flex flex-col items-center pt-8', className)}>
        <div className="w-full max-w-4xl">
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
          </div>
          <div className="text-center py-12">
            <div className="text-red-500 font-comfortaa">
              <p className="text-xl mb-2">Error loading leave requests</p>
              <p className="text-sm">{error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Ensure requests is an array and handle potential API errors
  const requestsArray = Array.isArray(requests) ? requests : [];
  
  // Separate pending and completed requests
  const pendingRequests = requestsArray.filter(req => req.status === 'Pending' || !req.status) || [];
  const completedRequests = requestsArray.filter(req => req.status === 'Approved' || req.status === 'Not Approved') || [];

  // Get the most recent pending request for form display
  const latestPendingRequest = pendingRequests.length > 0 ? pendingRequests[0] : null;

  // Transform completed requests for display
  const displayRequests = transformToDisplayFormat(completedRequests);

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
          {latestPendingRequest && (
            <StatusIndicator status={latestPendingRequest.status} />
          )}
        </div>
        
        <div className="space-y-8">
          {/* Show form for new requests or pending requests */}
          {userRole === 'Teacher' || userRole === 'Learning Advisor' ? (
            <AbsenceRequestForm 
              isPending={pendingRequests.length > 0}
            />
          ) : (
            // Manager view - approval interface
            <ManagerApprovalInterface pendingRequests={pendingRequests} />
          )}
          
          {/* Show completed requests in list */}
          <LeaveRequestList requests={displayRequests} />
        </div>
      </div>
    </div>
  );
};

export default AbsentRequestPage; 