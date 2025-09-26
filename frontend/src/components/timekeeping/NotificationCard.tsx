import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import type { NotificationData } from "@/mockData/timeEntriesMock";

interface NotificationCardProps {
  notification: NotificationData;
  className?: string;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification, className }) => {
  return (
    <div className={cn(
      "bg-white rounded-[15px] p-[14px] px-[27px] flex flex-col items-center gap-[11px] w-[358px] h-[219px]",
      className
    )}>
      {/* Alert Icon */}
      <div className="w-6 h-6">
        <AlertCircle 
          className="w-full h-full" 
          style={{
            stroke: "rgba(247, 46, 46, 0.92)",
            strokeWidth: "4px"
          }}
        />
      </div>
      
      {/* Message */}
      <div className="text-[22px] font-semibold text-black font-comfortaa text-center leading-[1.4]">
        {notification.message}
      </div>
    </div>
  );
};

export default NotificationCard; 