import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';
import type { StudentData } from '@/mockData/studentListMock';

interface FeatureButtonListProps {
  className?: string;
  classId?: string; // Optional classId for class-specific routes
  courseId?: string;
  courseDate?: string;
  term?: number | string;
}

interface FeatureButton {
  id: string;
  title: string;
  route?: string;
  onClick?: () => void;
}

const FeatureButtonList: React.FC<FeatureButtonListProps> = ({ className, classId, courseId, courseDate, term }) => {
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
      route: classId && courseId && courseDate && term ? `/attendance/${classId}/${courseId}/${courseDate}/${term}` : undefined,
      onClick: () => navigate(
        classId && courseId && courseDate && term
          ? `/attendance/${classId}/${courseId}/${courseDate}/${term}`
          : '/attendance/1/COURSE/2024-01-01/1'
      )
    },
    {
      id: "report",
      title: "Report",
      route: "/report",
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
      <div className="flex items-center gap-3 justify-start">
        {featureButtons.map((button) => (
          <button
            key={button.id}
            onClick={() => handleButtonClick(button.id)}
            className={cn(
              // Base styling reduced to match status button size
              "bg-white border border-black/20 rounded-[10px]",
              "nth-1:bg-red-400 nth-1:text-white/90 nth-1:hover:bg-red-500 nth-1:hover:text-white",
              "px-4 h-8 transition-all duration-200 ease-in-out",
              "hover:bg-[#223A5E] hover:scale-110",
              "focus:outline-none focus:ring-1 focus:ring-black focus:ring-offset-1",
              "text-[14px] font-semibold text-black leading-[1em] font-comfortaa",
              "whitespace-nowrap hover:text-white",
              // Active state styling
              activeButton === button.id && "bg-gray-100 scale-105",
              // Responsive sizing based on sidebar state - reduced sizes
              isExpanded ? "min-w-[80px]" : "min-w-[90px]"
            )}
          >
            {button.title}            
          </button>
        ))}
      </div>
    </div>
  );
};

export default FeatureButtonList;
