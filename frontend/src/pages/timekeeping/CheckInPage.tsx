import React from "react";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { Calendar } from "lucide-react";

// Import check-in components
import StatCard from "@/components/checkin/StatCard";
import CheckInButton from "@/components/checkin/CheckInButton";
import TodayCheckIn from "@/components/checkin/TodayCheckIn";
import UpcomingClassesPanel from "@/components/checkin/UpcomingClassesPanel";
import PageTitle from "@/components/checkin/PageTitle";
import CheckInContainer from "@/components/checkin/CheckInContainer";

// Import mock data
import { upcomingClassesMock, statCardsMock } from "@/mockData/checkinMock";

interface CheckInPageProps {
  className?: string;
}

// Internal component that uses the sidebar context
const CheckInPageContent: React.FC<CheckInPageProps> = ({ className }) => {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";

  const handleCheckIn = () => {
    console.log("Check-in action triggered");
    // Add check-in logic here
  };

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
          <div className="flex-1 p-4 pt-8 grid grid-cols-1 lg:grid-cols-[48%_52%] gap-4 h-full max-h-screen overflow-hidden">
            
            {/* Left Column - Wider */}
            <div className="flex flex-col gap-3 h-full max-h-screen">
              
              {/* Page Title */}
              <PageTitle />

              {/* Stats Section - Side by side */}
              <div className="grid grid-cols-2 gap-3 flex-shrink-0">
                {statCardsMock.map((stat, index) => (
                  <StatCard
                    key={index}
                    icon={
                      stat.icon === "calendar" ? (
                        <Calendar className="w-8 h-8" />
                      ) : (
                        <Calendar className="w-8 h-8" />
                      )
                    }
                    value={stat.value}
                    label={stat.label}
                  />
                ))}
              </div>

              {/* Check-in Container - Takes remaining space with max height */}
              <div className="flex-1 min-h-0 max-h-[calc(100vh-200px)]">
                <CheckInContainer onCheckIn={handleCheckIn} />
              </div>

            </div>

            {/* Right Column - Narrower */}
            <div className="flex flex-col gap-0 h-full max-h-full">
              {/* Empty space to align with page title */}
              <div className="h-[55px] flex-shrink-0"></div>
              
              {/* Upcoming Classes Panel - Aligns with stats top and check-in bottom */}
              <div className="flex-1 min-h-0 max-h-[calc(100vh-200px)]">
                <UpcomingClassesPanel classes={upcomingClassesMock} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main wrapper component that provides sidebar context
const CheckInPage: React.FC<CheckInPageProps> = ({ className }) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <CheckInPageContent className={className} />
    </SidebarProvider>
  );
};

export default CheckInPage; 