import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Calendar, Clock } from "lucide-react";

// Import check-in components
import StatCard from "@/components/checkin/StatCard";
import UpcomingClassesPanel from "@/components/checkin/UpcomingClassesPanel";
import PageTitle from "@/components/checkin/PageTitle";
import CheckInContainer from "@/components/checkin/CheckInContainer";

// Import hooks
import { useCheckIn } from "@/hooks/entities/useCheckIn";
import { useAuth } from "@/contexts/AuthContext";
//import { useAuth } from "@/contexts/MockAuthContext";

// Import mock data
import { statCardsMock } from "@/mockData/checkinMock";

// Import time utility
import { getCurrentTime } from "@/lib/utils";

interface CheckInPageProps {
  className?: string;
}

const CheckInPage: React.FC<CheckInPageProps> = ({ className }) => {
  const { user } = useAuth();
  const { 
    performCheckIn, 
    isLoading, 
    error, 
    success, 
    clearMessages,
    hasCheckedInToday,
    checkCheckedInToday,
    teacherClasses,
    isLoadingClasses,
    classesError,
    fetchTeacherClasses
  } = useCheckIn();

  // Get current time once when component mounts
  const currentTime = getCurrentTime();

  // Determine if user is manager or learning advisor
  const isManagerOrAdvisor = user?.role === 'Manager' || user?.role === 'Learning Advisor';

  console.log('🔍 CheckInPage - Current user:', user);

  // Fetch teacher classes when component mounts (only for teachers)
  useEffect(() => {
    if (user?.id && !isManagerOrAdvisor) {
      console.log('🔍 CheckInPage - Fetching teacher classes for user:', user.id);
      fetchTeacherClasses();
    }
  }, [user?.id, fetchTeacherClasses, isManagerOrAdvisor]);

  // Read-only check: has the user already checked in today?
  useEffect(() => {
    if (user?.id) {
      checkCheckedInToday(user.id);
    }
  }, [user?.id, checkCheckedInToday]);

  const handleCheckIn = async () => {
    console.log('🔍 CheckInPage - Check-in button clicked');
    console.log('🔍 CheckInPage - User ID:', user?.id);
    
    if (!user?.id) {
      console.error("❌ CheckInPage - No user ID available");
      return;
    }

    try {
      console.log('🔍 CheckInPage - Calling performCheckIn with employee ID:', user.id);
      await performCheckIn(user.id);
      // Clear messages after 3 seconds
      setTimeout(() => {
        clearMessages();
      }, 3000);
    } catch (err) {
      console.error("❌ CheckInPage - Check-in failed:", err);
    }
  };

  return (
    <div className={cn("h-full w-full overflow-auto flex flex-col", className)}>
      <PageTitle className="m-4"/>
      {/* Main Content using Flex */}
      <div className="h-full w-full flex flex-row gap-10 justify-start">
        {/* Left Column - Wider */}
        <div className="flex flex-col gap-3 h-full w-[50%]">
          {/* Stats Section - Side by side */}
          <div className="flex flex-row gap-3 w-full h-[24%]">
            {statCardsMock.map((stat, index) => (
              <StatCard
                key={index}
                icon={
                  stat.icon === "calendar" ? (
                    <Calendar className="w-8 h-8" />
                  ) : (
                    <Clock className="w-8 h-8" />
                  )
                }
                value={index === 1 ? currentTime : stat.value}
                label={stat.label}
                className="w-full"
              />
            ))}
          </div>

          {/* Check-in Container - Takes remaining space with max height */}
          <div className="h-[70%]">
            <CheckInContainer 
              onCheckIn={handleCheckIn} 
              isLoading={isLoading}
              error={error}
              success={success}
              disabled={hasCheckedInToday}
            />
          </div>

        </div>

        {/* Right Column - Narrower */}
        <div className="h-full w-[50%]">                    
          {/* Upcoming Classes Panel - Aligns with stats top and check-in bottom */}
          <div className="h-auto max-h-[94%]">
            <UpcomingClassesPanel 
              classes={isManagerOrAdvisor ? [] : teacherClasses} 
              isLoading={isManagerOrAdvisor ? false : isLoadingClasses}
              error={isManagerOrAdvisor ? undefined : classesError}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckInPage; 