import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useIssues, useUpdateIssue } from '@/hooks/entities/useIssues';
import { useAuth } from '@/contexts/AuthContext';
import type { IssueDisplay } from '@/types/issue';

interface IssuesListProps {
  className?: string;
}

const IssuesList: React.FC<IssuesListProps> = ({ className }) => {
  const { data: issues, isLoading, error } = useIssues();
  const { updateIssue, isLoading: isUpdating } = useUpdateIssue();
  const { user } = useAuth();

  const canUpdateIssue = user?.role === 'Learning Advisor' || user?.role === 'Manager';

  const handleUpdateIssue = async (id: string) => {
    await updateIssue(id);
  };
  // Status indicator component
  const StatusIndicator = ({ status }: { status: 'In Progress' | 'Done' }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'In Progress':
          return 'bg-yellow-400 text-yellow-900';
        case 'Done':
          return 'bg-green-500 text-white';
        default:
          return 'bg-gray-400 text-gray-900';
      }
    };

    const getStatusText = (status: string) => {
      switch (status) {
        case 'In Progress':
          return 'IN PROGRESS';
        case 'Done':
          return 'DONE';
        default:
          return 'UNKNOWN';
      }
    };

    return (
      <div className={cn(
        'px-3 py-1 rounded-full font-comfortaa font-bold text-xs',
        getStatusColor(status)
      )}>
        {getStatusText(status)}
      </div>
    );
  };

  // Issue type badge
  const IssueTypeBadge = ({ type }: { type: 'Student Behavior' | 'Technical' }) => {
    const getTypeColor = (type: string) => {
      switch (type) {
        case 'Student Behavior':
          return 'bg-blue-100 text-blue-800 border border-blue-200';
        case 'Technical':
          return 'bg-orange-100 text-orange-800 border border-orange-200';
        default:
          return 'bg-gray-100 text-gray-800 border border-gray-200';
      }
    };

    return (
      <div className={cn(
        'px-3 py-1 rounded-full font-comfortaa font-medium text-xs',
        getTypeColor(type)
      )}>
        {type}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="flex items-center space-x-4 mb-6">
          <h2 className="text-3xl font-bold font-comfortaa" style={{ color: '#945CD8' }}>
            Issue History
          </h2>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>
        
        <div className="text-center py-12">
          <div className="text-gray-500 font-comfortaa">
            <p className="text-xl mb-2">Loading issues...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="flex items-center space-x-4 mb-6">
          <h2 className="text-3xl font-bold font-comfortaa" style={{ color: '#945CD8' }}>
            Issue History
          </h2>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>
        
        <div className="text-center py-12">
          <div className="text-red-500 font-comfortaa">
            <p className="text-xl mb-2">Error loading issues</p>
            <p className="text-sm">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  // Ensure issues is always an array
  const issuesArray = Array.isArray(issues) ? issues : [];
  
  if (!issuesArray || issuesArray.length === 0) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="flex items-center space-x-4 mb-6">
          <h2 className="text-3xl font-bold font-comfortaa" style={{ color: '#945CD8' }}>
            Issue History
          </h2>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>
        
        <div className="text-center py-12">
          <div className="text-gray-500 font-comfortaa">
            <p className="text-xl mb-2">No issues found</p>
            <p className="text-sm">No issues have been reported yet</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center space-x-4 mb-6">
        <h2 className="text-3xl font-bold font-comfortaa" style={{ color: '#945CD8' }}>
          Issue History
        </h2>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>

      <div className="flex flex-col-reverse gap-y-4">
        {issuesArray.map((issue: any) => (
          <Card key={issue.id} className="shadow-md hover:shadow-lg transition-shadow duration-200 border-0 bg-white">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header with title and status */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-comfortaa font-semibold text-lg text-gray-800 mb-2">
                      {issue.issue_description}
                    </h3>
                  </div>
                                     <div className="flex items-center space-x-2 ml-4">
                     <IssueTypeBadge type={issue.issue_type} />
                     <StatusIndicator status={issue.status} />
                                         {canUpdateIssue && issue.status === 'In Progress' && (
                      <Button
                        onClick={() => handleUpdateIssue(issue.id)}
                        disabled={isUpdating}
                        className="bg-green-600 hover:bg-green-700 text-white font-comfortaa font-semibold px-4 py-1 text-xs"
                      >
                        {isUpdating ? 'UPDATING...' : 'MARK DONE'}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Issue details grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs font-comfortaa font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Issue ID
                    </div>
                    <div className="font-comfortaa text-sm text-gray-800 font-mono">
                      {issue.id}
                    </div>
                  </div>

                                     <div className="bg-gray-50 rounded-lg p-3">
                     <div className="text-xs font-comfortaa font-medium text-gray-500 uppercase tracking-wide mb-1">
                       Reported By
                     </div>
                     <div className="font-comfortaa text-sm text-gray-800">
                       {issue.teacher_id}
                     </div>
                   </div>

                                     {issue.issue_type === 'Student Behavior' && issue.student_id && (
                     <div className="bg-gray-50 rounded-lg p-3">
                       <div className="text-xs font-comfortaa font-medium text-gray-500 uppercase tracking-wide mb-1">
                         Student ID
                       </div>
                       <div className="font-comfortaa text-sm text-gray-800">
                         {issue.student_id}
                       </div>
                     </div>
                   )}

                   {issue.issue_type === 'Technical' && issue.room_id && (
                     <div className="bg-gray-50 rounded-lg p-3">
                       <div className="text-xs font-comfortaa font-medium text-gray-500 uppercase tracking-wide mb-1">
                         Room ID
                       </div>
                       <div className="font-comfortaa text-sm text-gray-800">
                         {issue.room_id}
                       </div>
                     </div>
                   )}

                                     <div className="bg-gray-50 rounded-lg p-3">
                     <div className="text-xs font-comfortaa font-medium text-gray-500 uppercase tracking-wide mb-1">
                       Reported Date
                     </div>
                     <div className="font-comfortaa text-sm text-gray-800">
                       {issue.reported_date ? new Date(issue.reported_date).toLocaleDateString() : 'N/A'}
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

export default IssuesList;