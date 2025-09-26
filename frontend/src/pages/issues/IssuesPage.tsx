import React from 'react';
import { cn } from '@/lib/utils';
import IssueForm from '@/components/issues/IssueForm';
import IssuesList from '@/components/issues/IssuesList';
import { useAuth } from '@/contexts/AuthContext';
import { AlertTriangle } from 'lucide-react';

interface IssuesPageProps {
  className?: string;
}

const IssuesPage: React.FC<IssuesPageProps> = ({ className }) => {
  const { user } = useAuth();
  const userRole = user?.role;

  // Status indicator component
  const StatusIndicator = ({ status }: { status: 'Open' | 'Done' }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'Open':
          return 'bg-yellow-400 text-yellow-900';
        case 'Done':
          return 'bg-green-500 text-white';
        default:
          return 'bg-gray-400 text-gray-900';
      }
    };

    const getStatusText = (status: string) => {
      switch (status) {
        case 'Open':
          return 'OPEN';
        case 'Done':
          return 'DONE';
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
        {/* Title and Icon Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
              <AlertTriangle 
                className="w-12 h-12"
                style={{ color: '#945CD8' }}
              />
            </div>
            <h1 className="text-5xl font-bold font-comfortaa" style={{ color: '#945CD8' }}>
              Issues Management
            </h1>
          </div>
        </div>
        
        <div className="space-y-8">
          {/* Role-based view */}
          {userRole === 'Teacher' ? (
            // Teacher view - form and their issues
            <>
              <IssueForm />
              <IssuesList />
            </>
          ) : (
            // Learning Advisor and Manager view - manage all issues
            <>
              <IssuesList />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default IssuesPage;