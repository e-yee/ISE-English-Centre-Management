import React from 'react';
import { cn } from '@/lib/utils';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar';
import AbsenceRequestForm from '@/components/absent-request/AbsenceRequestForm';
import absentRequestIcon from '@/assets/sidebar/absent-request.svg';

interface AbsentRequestPageProps {
  className?: string;
}

const AbsentRequestPageContent: React.FC<AbsentRequestPageProps> = ({ className }) => {
  const { state } = useSidebar();
  const isExpanded = state === 'expanded';

  return (
    <div className={cn('h-screen w-screen bg-gray-50 overflow-hidden', className)}>
      <div className="w-full h-20">
        <Header isRegistered={true} />
      </div>

      <div className="relative h-[calc(100vh-5rem)]">
        <div className="absolute left-0 top-0 h-full">
          <Sidebar />
        </div>

        <div
          className={cn(
            'h-full transition-all duration-300 ease-in-out overflow-y-auto flex flex-col items-center pt-8',
            isExpanded ? 'ml-[335px]' : 'ml-[120px]'
          )}
        >
          <div className="w-full max-w-4xl">
            {/* Title and Icon Section - positioned on the left side */}
            <div className="flex items-center space-x-4 mb-8">
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
            
            <AbsenceRequestForm />
          </div>
        </div>
      </div>
    </div>
  );
};

const AbsentRequestPage: React.FC<AbsentRequestPageProps> = ({ className }) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <AbsentRequestPageContent className={className} />
    </SidebarProvider>
  );
};

export default AbsentRequestPage; 