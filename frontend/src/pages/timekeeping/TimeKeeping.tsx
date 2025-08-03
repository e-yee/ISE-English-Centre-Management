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
      className="flex bg-white rounded-[15px] shadow-lg border border-gray-200 overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-200"
      onClick={handleCheckInClick}
    >
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
  const navigate = useNavigate();

  const handleTimeEntriesClick = () => {
    navigate('/time-entries');
  };

  return (
    <div 
      className="flex bg-white rounded-[15px] shadow-lg border border-gray-200 overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-200"
      onClick={handleTimeEntriesClick}
    >
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

const TimeKeepingPage: React.FC<TimeKeepingPageProps> = ({ className }) => {
  return (
    <div className={cn("h-full overflow-y-auto", className)}>
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
  );
};

export default TimeKeepingPage; 