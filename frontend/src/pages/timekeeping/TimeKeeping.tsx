import React from "react";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import checkinIcon from "@/assets/checkin/checkin-icon.png";
import listIcon from "@/assets/checkin/list-icon.svg";

interface CheckInPageProps {
  className?: string;
}

// Check In Card Component
const CheckInCard: React.FC = () => {
  return (
    <div className="flex bg-white rounded-[15px] shadow-lg border border-gray-200 overflow-hidden">
      {/* Left side with icon */}
      <div className="w-[119px] h-[118px] bg-[rgba(239,21,21,0.2)] flex items-center justify-center rounded-l-[15px]">
        <img 
          src={checkinIcon} 
          alt="Check In" 
          className="w-16 h-16 object-contain"
        />
      </div>
      
      {/* Right side with details */}
      <div className="flex-1 p-6 flex flex-col justify-center">
        <h3 className="text-[30px] font-semibold text-black mb-2 font-comfortaa">
          Check In
        </h3>
        <p className="text-[16px] font-semibold text-black/50 font-comfortaa">
          Daily check in
        </p>
      </div>
    </div>
  );
};

// Recent Time Entries Card Component
const RecentTimeEntriesCard: React.FC = () => {
  return (
    <div className="flex bg-white rounded-[15px] shadow-lg border border-gray-200 overflow-hidden">
      {/* Left side with icon */}
      <div className="w-[119px] h-[118px] bg-[rgba(171,125,251,0.85)] flex items-center justify-center rounded-l-[15px]">
        <img 
          src={listIcon} 
          alt="Recent Time Entries" 
          className="w-12 h-12 object-contain"
        />
      </div>
      
      {/* Right side with details */}
      <div className="flex-1 p-6 flex flex-col justify-center">
        <h3 className="text-[30px] font-semibold text-black mb-2 font-comfortaa text-left">
          Recent Time Entries
        </h3>
        <p className="text-[16px] font-semibold text-black/50 font-comfortaa">
          Track daily check in
        </p>
      </div>
    </div>
  );
};

// Internal component that uses the sidebar context
const TimeKeepingContent: React.FC<CheckInPageProps> = ({ className }) => {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";

  return (
    <div className={cn("h-screen w-screen bg-gray-50 overflow-hidden font-comfortaa", className)}>
      {/* Header - Always at top, full width */}
      <div className="w-full h-20"> {/* Fixed header height */}
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
          {/* Main Content Container */}
          <div className="flex-1 p-8 overflow-y-auto">
            {/* Large Title */}
            <div className="text-center mb-8">
              <h1 className="text-[50px] font-bold bg-gradient-to-r from-[#6641D4] to-[#35226E] bg-clip-text text-transparent font-comfortaa">
                Check In
              </h1>
            </div>

            {/* Cards Container */}
            <div className="max-w-6xl mx-auto grid grid-cols-2 gap-6">
              <CheckInCard />
              <RecentTimeEntriesCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main wrapper component that provides sidebar context
const TimeKeepingPage: React.FC<CheckInPageProps> = ({ className }) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <TimeKeepingContent className={className} />
    </SidebarProvider>
  );
};

export default TimeKeepingPage; 