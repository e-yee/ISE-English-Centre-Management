import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';

interface FeatureButtonListProps {
  className?: string;
  classId?: string; // Optional classId for class-specific routes
}

interface FeatureButton {
  id: string;
  title: string;
  route?: string;
  onClick?: () => void;
}

const FeatureButtonList: React.FC<FeatureButtonListProps> = ({ className, classId }) => {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const navigate = useNavigate();

  // Determine if we're currently on the class page or a feature page
  const isOnClassPage = window.location.pathname.includes('/class/') && !window.location.pathname.includes('/class-info/') && !window.location.pathname.includes('/scoring/');

  // Feature buttons with routing
  const featureButtons: FeatureButton[] = [
    {
      id: "back",
      title: "Back",
      route: isOnClassPage ? "/home" : (classId ? `/class/${classId}` : "/class/1"),
      onClick: () => navigate(isOnClassPage ? "/home" : (classId ? `/class/${classId}` : "/class/1"))
    },
    {
      id: "information",
      title: "Information",
      route: classId ? `/class-info/${classId}` : "/class-info/1", // Default classId if not provided
      onClick: () => navigate(classId ? `/class-info/${classId}` : "/class-info/1")
    },
    {
      id: "scoring",
      title: "Scoring", 
      route: classId ? `/scoring/${classId}` : "/scoring/1", // Use class-specific scoring route
      onClick: () => navigate(classId ? `/scoring/${classId}` : "/scoring/1")
    },
    {
      id: "daily-attendance",
      title: "Daily Attendance",
      route: "/attendance",
      onClick: () => navigate("/attendance")
    },
    {
      id: "report",
      title: "Report",
      route: "/report",
      onClick: () => navigate("/report")
    },
    {
      id: "export-report",
      title: "Export Report",
      route: "/report", // Using report route, could be enhanced with export functionality
      onClick: () => navigate("/report")
    }
  ];

  const handleButtonClick = (buttonId: string) => {
    setActiveButton(buttonId);
    const button = featureButtons.find(btn => btn.id === buttonId);
    if (button?.onClick) {
      button.onClick();
    }
  };

  return (
    <div className={cn(
      "w-full transition-all duration-300 ease-in-out",
      className
    )}>
      {/* Horizontal row of feature buttons */}
      <div className="flex items-center gap-4 justify-start">
        {featureButtons.map((button) => (
          <button
            key={button.id}
            onClick={() => handleButtonClick(button.id)}
            className={cn(
              // Base styling reduced to match status button size
              "bg-white border border-black/20 rounded-[10px]",
              "shadow-[2px_2px_3px_0px_rgba(0,0,0,0.15)]",
              "px-4 py-2 transition-all duration-200 ease-in-out",
              "hover:shadow-[3px_3px_4px_0px_rgba(0,0,0,0.2)] hover:scale-105",
              "focus:outline-none focus:ring-1 focus:ring-black focus:ring-offset-1",
              // Active state styling
              activeButton === button.id && "bg-gray-100 scale-105",
              // Responsive sizing based on sidebar state - reduced sizes
              isExpanded ? "min-w-[80px]" : "min-w-[90px]"
            )}
          >
            <span className={cn(
              // Typography reduced to match status button size
              "text-[16px] font-semibold text-black leading-[1em] font-comfortaa",
              "whitespace-nowrap"
            )}>
              {button.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FeatureButtonList;
