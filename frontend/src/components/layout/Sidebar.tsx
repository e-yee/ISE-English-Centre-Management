import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/useSidebar";

interface SidebarProps {
  className?: string;
}

interface SidebarItem {
  id: string;
  title: string;
  icon: string;
  url: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const { isExpanded, toggleExpanded } = useSidebar();
  const [activeItem, setActiveItem] = useState("dashboard");

  const menuItems: SidebarItem[] = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: "/src/assets/sidebar/dashboard.svg",
      url: "#",
    },
    {
      id: "absence-request",
      title: "Absence Request",
      icon: "/src/assets/sidebar/absent-request.svg",
      url: "#",
    },
    {
      id: "timekeeping",
      title: "Timekeeping",
      icon: "/src/assets/sidebar/timekeeping.svg",
      url: "#",
    },
    {
      id: "colleagues",
      title: "Colleagues",
      icon: "/src/assets/sidebar/collegues.svg",
      url: "#",
    },
    {
      id: "daily-report",
      title: "Daily Report",
      icon: "/src/assets/sidebar/daily-report.svg",
      url: "#",
    },
    {
      id: "materials",
      title: "Materials",
      icon: "/src/assets/sidebar/material.svg",
      url: "#",
    },
  ];

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
    // Add navigation logic here
    console.log(`Navigating to ${itemId}`);
  };

  return (
    <div className={cn("fixed left-0 top-35 z-50", className)}>
      {/* Main Sidebar Container */}
      <div
        className={cn(
          "relative transition-all duration-300 ease-in-out",
          isExpanded
            ? "bg-white border-[5px] border-r-[5px] border-b-[5px] border-l-[2px] border-black rounded-[0px_30px_30px_0px] shadow-[5px_7px_4px_rgba(0,0,0,0.25)] w-[295px] h-[710px]"
            : "w-20 h-[430px]"
        )}
      >
        {/* FEATURES Title */}
        {isExpanded && (
          <div className="absolute w-[204px] h-9 -top-px -left-1 bg-white rounded-[0px_0px_20px_0px] border-2 border-solid border-black shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
            <div className="absolute w-full h-8 top-0.5 left-0 font-['Rhodium_Libre'] font-normal text-black text-3xl text-center tracking-[0] leading-10 whitespace-nowrap flex items-center justify-center">
              FEATURES
            </div>
          </div>
        )}

        {/* Back Button - positioned inside sidebar at top right when expanded, centered when compressed */}
        <button
          onClick={toggleExpanded}
          className={cn(
            "absolute hover:opacity-80 transition-opacity",
            isExpanded ? "right-4 top-2 w-10 h-10" : "left-1/2 transform -translate-x-1/2 top-2 w-8 h-8"
          )}
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          <img
            src="/src/assets/sidebar/back-button.svg"
            alt="Back button"
            className={cn(
              "w-full h-full transition-transform duration-300",
              !isExpanded && "rotate-180"
            )}
          />
        </button>

        {/* Menu Items Container */}
        <div className={cn(
          "absolute left-0 right-0",
          isExpanded ? "top-12 bottom-4 px-4" : "top-20 px-2"
        )}>
          <div className={cn(
            isExpanded ? "space-y-4 pt-6 pb-4" : "space-y-3 pt-2 pb-2 flex flex-col items-center"
          )}>
            {menuItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={cn(
                  "group cursor-pointer transition-all duration-300 ease-out",
                  "transform-gpu", // Enable hardware acceleration for smoother animations
                  isExpanded
                    ? "bg-white rounded-2xl border-b border-black shadow-[0px_4px_4px_rgba(0,0,0,0.25)] hover:scale-105 hover:shadow-[0px_8px_12px_rgba(0,0,0,0.4)] flex items-center gap-3 p-3"
                    : "flex justify-center items-center w-12 h-12 mx-auto hover:scale-105",
                  // Active state styling
                  activeItem === item.id && isExpanded && "shadow-[0px_6px_8px_rgba(0,0,0,0.35)]"
                )}
              >
                {/* Icon */}
                <div className={cn(
                  isExpanded ? "h-16 w-16" : "h-8 w-8",
                  "flex-shrink-0 transition-transform duration-300 ease-out group-hover:scale-105"
                )}>
                  <img
                    src={item.icon}
                    alt={`${item.title} icon`}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Label - only show when expanded */}
                {isExpanded && (
                  <span className="text-lg font-normal text-black font-['Rhodium_Libre'] text-center">
                    {item.title}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
