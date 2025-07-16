import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Class from "@/components/class/Class";
import { SearchInput } from "@/components/ui/SearchInput";
import { SidebarProvider, useSidebar } from "@/hooks/useSidebar";
import type { ClassData } from "@/mockData/classListMock";
import { classListMockData } from "@/mockData/classListMock";

interface HomescreenPageProps {
  className?: string;
}

// Internal component that uses the sidebar context
const HomescreenPageContent: React.FC<HomescreenPageProps> = ({ className }) => {
  const { isExpanded } = useSidebar();
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  // Status options with their corresponding icons and colors
  const statusOptions = [
    { value: "ALL", label: "ALL", icon: "/src/assets/status/all.svg", color: "#22E2F8" },
    { value: "TODAY", label: "Today", icon: "/src/assets/status/today.svg", color: "#109A7C" },
    { value: "TOMORROW", label: "Tomorrow", icon: "/src/assets/status/tomorrow.svg", color: "#4F5F9C" },
    { value: "COMING_SOON", label: "Coming Soon", icon: "/src/assets/status/coming_soon.svg", color: "#FF8037" },
    { value: "FUTURE", label: "Future", icon: "/src/assets/status/future.svg", color: "#16A085" },
    { value: "EXPIRED", label: "Expired", icon: "/src/assets/status/expired.svg", color: "#FFB30D" },
  ];

  const handleSearch = (value: string) => {
    console.log("Search value:", value);
    // Add search logic here
  };

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    setIsStatusDropdownOpen(false);
    console.log("Selected status:", status);
  };

  const selectedStatusOption = statusOptions.find(option => option.value === selectedStatus);

  return (
    <div className={cn("h-screen bg-gray-100 overflow-hidden", className)}>
      {/* Header - Full width at top */}
      <Header isRegistered={true} />

      {/* Main Layout Container */}
      <div className="flex h-[calc(100vh-96px)]">
        {/* Sidebar - Fixed position on left */}
        <Sidebar />

        {/* Main Content Area - Right side of sidebar */}
        <div className={cn(
          "flex-1 transition-all duration-300 ease-in-out flex flex-col h-full",
          isExpanded ? "ml-[295px]" : "ml-20"
        )}>
          {/* Filter Controls Container */}
          <div className={cn(
            "pt-4 pb-3 flex-shrink-0 transition-all duration-300 ease-in-out",
            isExpanded ? "px-8" : "px-4"
          )}>
            <div className="flex items-center justify-between">
              {/* Status Filter Button */}
              <div className="relative">
                <button
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-3",
                    "transition-all duration-200 hover:scale-105",
                    "w-full h-full justify-center"
                  )}
                >
                  {selectedStatusOption && (
                    <img
                      src={selectedStatusOption.icon}
                      alt={selectedStatusOption.label}
                      className="w-50 h-full"
                    />
                  )}
                  <svg
                    className={cn(
                      "w-3 h-3 transition-transform duration-200 text-black",
                      isStatusDropdownOpen && "rotate-180"
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Status Dropdown */}
                {isStatusDropdownOpen && (
                  <div className={cn(
                    "absolute top-full left-0 mt-2 bg-white rounded-[20px]",
                    "border-[3px] border-black shadow-[5px_10px_10px_0px_rgba(0,0,0,0.25)]",
                    "z-50 min-w-[200px] overflow-hidden"
                  )}>
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleStatusSelect(option.value)}
                        className={cn(
                          "w-full flex items-center justify-center px-4 py-3",
                          "hover:bg-gray-100 transition-colors duration-150",
                          "border-b border-gray-200 last:border-b-0"
                        )}
                      >
                        <img
                          src={option.icon}
                          alt={option.label}
                          className="w-full h-full"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Input - Positioned at rightmost, widens when sidebar compressed */}
              <div className={cn(
                "ml-auto transition-all duration-300 ease-in-out",
                isExpanded ? "max-w-md" : "max-w-lg"
              )}>
                <SearchInput
                  onSearch={handleSearch}
                  placeholder="Search..."
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Class List Container - Full width and height */}
          <div className="flex-1 flex overflow-hidden pb-4">
            {/* Left padding spacer - reduced when sidebar is compressed */}
            <div className={cn(
              "flex-shrink-0 transition-all duration-300 ease-in-out",
              isExpanded ? "w-8" : "w-2"
            )}></div>
            {/* Class List - extends to right edge */}
            <div className="flex-1 overflow-hidden">
              <ClassList classes={classListMockData} />
            </div>
          </div>
        </div>
      </div>

      {/* Click outside handler for dropdown */}
      {isStatusDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsStatusDropdownOpen(false)}
        />
      )}
    </div>
  );
};

// Main ClassList component for homescreen
interface ClassListProps {
  classes?: ClassData[];
  className?: string;
}

const ClassList: React.FC<ClassListProps> = ({
  classes = classListMockData,
  className
}) => {
  const { isExpanded } = useSidebar();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  // Limit to first 8 classes to fit on one page
  const displayedClasses = classes.slice(0, 8);

  return (
    <form onSubmit={handleSubmit} className={cn(
      // Main container with light grey background, rounded corners, and drop shadow
      'bg-white relative h-full flex',
      'shadow-[inset_5px_4px_4px_0px_rgba(0,0,0,0.25)]', // Inset shadow as per Figma
      'w-full transition-all duration-300 ease-in-out', // Add smooth animation
      className
    )}>
      {/* Content area with left padding - adjusted based on sidebar state */}
      <div className={cn(
        "flex-1 pr-0 overflow-hidden transition-all duration-300 ease-in-out",
        isExpanded ? "p-4" : "p-2 pl-4" // Reduce padding when sidebar is compressed
      )}>
        <div className="h-full overflow-hidden">
          {/* Classes Grid with Scroll View - scrollbar extends to right edge */}
          <div
            className="h-full overflow-y-auto space-y-3 custom-scrollbar"
          >
            {displayedClasses.map((classData) => (
              <Class
                key={classData.id}
                classData={classData}
                className="w-full mr-4" // Add right margin to content, not scrollbar
              />
            ))}
          </div>
        </div>
      </div>
    </form>
  );
};

// Main wrapper component that provides sidebar context
const HomescreenPage: React.FC<HomescreenPageProps> = ({ className }) => {
  return (
    <SidebarProvider>
      <HomescreenPageContent className={className} />
    </SidebarProvider>
  );
};

export default HomescreenPage;
