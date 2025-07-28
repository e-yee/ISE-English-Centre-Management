import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';

interface FeatureButtonListProps {
  className?: string;
}

interface FeatureButton {
  id: string;
  title: string;
  onClick?: () => void;
}

const FeatureButtonList: React.FC<FeatureButtonListProps> = ({ className }) => {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";
  const [activeButton, setActiveButton] = useState<string | null>(null);

  // Feature buttons as specified in the implementation plan
  const featureButtons: FeatureButton[] = [
    {
      id: "information",
      title: "Information",
      onClick: () => console.log("Information clicked")
    },
    {
      id: "scoring",
      title: "Scoring", 
      onClick: () => console.log("Scoring clicked")
    },
    {
      id: "daily-attendance",
      title: "Daily Attendance",
      onClick: () => console.log("Daily Attendance clicked")
    },
    {
      id: "materials",
      title: "Materials",
      onClick: () => console.log("Materials clicked")
    },
    {
      id: "report",
      title: "Report",
      onClick: () => console.log("Report clicked")
    },
    {
      id: "export-report",
      title: "Export Report",
      onClick: () => console.log("Export Report clicked")
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
