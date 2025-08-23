import React from "react";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface TimeEntriesPageTitleProps {
  title?: string;
  icon?: React.ReactNode;
  className?: string;
}

const TimeEntriesPageTitle: React.FC<TimeEntriesPageTitleProps> = ({ 
  title = "Recent Time Entries",
  icon = <Clock className="w-8 h-8" />,
  className 
}) => {
  return (
    <div className={cn(
      "flex items-center gap-3",
      className
    )}>
      {/* Icon with purple gradient */}
      <div className="w-8 h-8"
      style={{
        filter: "brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(246deg) brightness(104%) contrast(97%)"
      }}>
        {icon}
      </div>
      
      {/* Title with Gradient */}
      <h1 
        className="text-4xl font-bold"
        style={{
          background: "linear-gradient(90deg, #9D3EFD 0%, #6641D4 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}
      >
        {title}
      </h1>
    </div>
  );
};

export default TimeEntriesPageTitle; 