import React from "react";
import { cn } from "@/lib/utils";

// Import timekeeping components
import TimeEntriesPageTitle from "@/components/timekeeping/TimeEntriesPageTitle";
import TimeEntriesList from "@/components/timekeeping/TimeEntriesList";
import NotificationCard from "@/components/timekeeping/NotificationCard";

// Import mock data
import { timeEntriesMock, notificationMock } from "@/mockData/timeEntriesMock";

interface TimeEntriesPageProps {
  className?: string;
}

const TimeEntriesPage: React.FC<TimeEntriesPageProps> = ({ className }) => {
  return (
    <div className={cn("h-full overflow-hidden flex flex-col", className)}>
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
  );
};

export default TimeEntriesPage; 