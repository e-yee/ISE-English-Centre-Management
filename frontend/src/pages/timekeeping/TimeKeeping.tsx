import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import checkinIcon from "@/assets/checkin/checkin-icon.png";
import listIcon from "@/assets/checkin/list-icon.svg";

interface TimeKeepingPageProps {
  className?: string;
}

// Check In Card Component
const CheckInCard: React.FC = () => {
  const navigate = useNavigate();

  const handleCheckInClick = () => {
    navigate('/checkin');
  };

  return (
    <div 
      className="h-fit flex bg-white rounded-[15px] border border-gray-200 cursor-pointer hover:scale-105 hover:shadow-md transition-all duration-300"
      onClick={handleCheckInClick}
    >
      {/* Left side with icon */}
      <div className="w-[120px] py-5 bg-[rgba(239,21,21,0.2)] flex items-center justify-center rounded-l-[15px]">
        <img 
          src={checkinIcon} 
          alt="Check In" 
          className="w-16 h-16 object-contain"
        />
      </div>
      
      {/* Right side with details */}
      <div className="flex-1 pt-2 pl-2 flex flex-col justify-start">
        <h3 className="text-2xl font-bold text-black font-comfortaa">
          Check In
        </h3>
        <p className="text-md font-semibold text-black/50 font-comfortaa">
          Daily check in
        </p>
      </div>
    </div>
  );
};

// Recent Time Entries Card Component
const RecentTimeEntriesCard: React.FC = () => {
  const navigate = useNavigate();

  const handleTimeEntriesClick = () => {
    navigate('/time-entries');
  };

  return (
    <div 
      className="h-fit flex bg-white rounded-[15px] border border-gray-200 cursor-pointer hover:scale-105 hover:shadow-md transition-all duration-300"
      onClick={handleTimeEntriesClick}
    >
      {/* Left side with icon */}
      <div className="w-[120px] py-5 bg-[rgba(171,125,251,0.85)] flex items-center justify-center rounded-l-[15px]">
        <img 
          src={listIcon} 
          alt="Recent Time Entries" 
          className="w-16 h-16 object-contain"
        />
      </div>
      
      {/* Right side with details */}
      <div className="flex-1 pt-2 pl-2 flex flex-col justify-start">
        <h3 className="text-xl font-bold text-black font-comfortaa text-left">
          Recent Time Entries
        </h3>
        <p className="text-md font-semibold text-black/50 font-comfortaa">
          Track daily check in
        </p>
      </div>
    </div>
  );
};

const TimeKeepingPage: React.FC<TimeKeepingPageProps> = ({ className }) => {
  return (
    <div className={cn("h-full overflow-y-auto", className)}>
      {/* Main Content Container */}
      <div className="flex-1 pt-4 pl-4 h-full overflow-y-auto">
        {/* Large Title */}
        <div className="text-left">
          <h1 className="text-[50px] mb-5 font-bold bg-gradient-to-r from-[#6641D4] to-[#35226E] bg-clip-text text-transparent font-comfortaa">
            Check In
          </h1>
        </div>

        {/* Cards Container */}
        <div className="max-w-3xl h-fit grid grid-cols-2 gap-6">
          <CheckInCard />
          <RecentTimeEntriesCard />
        </div>
      </div>
    </div>
  );
};

export default TimeKeepingPage; 