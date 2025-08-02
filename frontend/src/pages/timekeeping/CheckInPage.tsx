import React from "react";
import { cn } from "@/lib/utils";
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

const CheckInPage: React.FC<CheckInPageProps> = ({ className }) => {
  const handleCheckIn = () => {
    console.log("Check-in action triggered");
    // Add check-in logic here
  };

  return (
    <div className={cn("h-full overflow-hidden flex flex-col", className)}>
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
  );
};

export default CheckInPage; 