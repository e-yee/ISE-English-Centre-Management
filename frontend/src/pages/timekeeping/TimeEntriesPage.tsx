import React from "react";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";

// Import timekeeping components
import TimeEntriesPageTitle from "@/components/timekeeping/TimeEntriesPageTitle";
import TimeEntriesList from "@/components/timekeeping/TimeEntriesList";
import NotificationCard from "@/components/timekeeping/NotificationCard";

// Import mock data
import { timeEntriesMock, notificationMock } from "@/mockData/timeEntriesMock";

interface TimeEntriesPageProps {
  className?: string;
}

// Internal component that uses the sidebar context
const TimeEntriesPageContent: React.FC<TimeEntriesPageProps> = ({ className }) => {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";

  return (
    <div className={cn("h-screen w-screen bg-gray-50 overflow-hidden font-comfortaa", className)}>
      {/* Header - Always at top, full width */}
      <div className="w-full h-20">
        <Header isRegistered={true} />
      </div>

      {/* Main content area with sidebar */}
      <div className="relative h-[calc(100vh-5rem)]">
        {/* Sidebar - positioned to touch bottom of header */}
        <div className="absolute left-0 top-0 h-full">
          <Sidebar />
        </div>

        {/* Content area - full remaining height */}
        <div className={cn(
          "h-full transition-all duration-300 ease-in-out overflow-hidden flex flex-col",
          isExpanded ? "ml-[335px]" : "ml-[120px]" // Space for sidebar + toggle button
        )}>
          {/* Main Content using Grid */}
          <div className="flex-1 p-4 pt-8 h-full max-h-screen overflow-hidden">
            
            {/* Page Title */}
            <div className="mb-6">
              <TimeEntriesPageTitle />
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-[2fr_1fr] gap-4 h-[calc(100vh-200px)]">
              
              {/* Left Column - Time Entries List (2/3 width, scrollable) */}
              <div className="bg-white rounded-[15px] overflow-hidden shadow-lg">
                <TimeEntriesList entries={timeEntriesMock} />
              </div>

              {/* Right Column - Notification Card (1/3 width, static) */}
              <div className="flex justify-center items-start pt-0">
                <NotificationCard notification={notificationMock} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main wrapper component that provides sidebar context
const TimeEntriesPage: React.FC<TimeEntriesPageProps> = ({ className }) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <TimeEntriesPageContent className={className} />
    </SidebarProvider>
  );
};

export default TimeEntriesPage; 