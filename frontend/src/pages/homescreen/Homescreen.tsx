import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import ClassList from "@/components/class/ClassList";
import { SearchInput } from "@/components/ui/SearchInput";
import { Button } from "@/components/ui/button";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { classListMockData } from "@/mockData/classListMock";

interface HomescreenPageProps {
  className?: string;
}

// Internal component that uses the sidebar context
const HomescreenPageContent: React.FC<HomescreenPageProps> = ({ className }) => {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Status options for horizontal buttons
  const statusOptions = [
    { value: "ALL", label: "ALL" },
    { value: "TODAY", label: "Today" },
    { value: "TOMORROW", label: "Tomorrow" },
    { value: "UPCOMING", label: "Upcoming" },
    { value: "EXPIRED", label: "Expired" },
  ];

  const handleSearch = (value: string) => {
    console.log("Search value:", value);
    // Add search logic here
  };

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    console.log("Selected status:", status);
  };

  return (
    <div className={cn("h-screen w-screen bg-gray-50 overflow-hidden font-comfortaa", className)}>
      {/* Header - Always at top, full width */}
      <div className="w-full h-20"> {/* Fixed header height */}
        <Header isRegistered={true} />
      </div>

      {/* Main content area with sidebar */}
      <div className="relative h-[calc(100vh-5rem)]">
        {/* Sidebar - positioned to touch bottom of header */}
        <div className="absolute left-0 top-0 h-full">
          <Sidebar />
        </div>

        {/* Content area - full remaining height */}
        <div className={cn(
          "h-full transition-all duration-300 ease-in-out overflow-hidden flex flex-col",
          isExpanded ? "ml-[335px]" : "ml-[120px]" // Space for sidebar + toggle button
        )}>
          {/* Filter Controls Container */}
          <div className={cn(
            "pt-4 pb-3 flex-shrink-0 transition-all duration-300 ease-in-out",
            "px-4"
          )}>
            <div className="flex items-center justify-between">
              {/* Status Filter Buttons - Horizontal Layout */}
              <div className="flex items-center gap-3">
                {statusOptions.map((option) => (
                  <Button
                    key={option.value}
                    onClick={() => handleStatusSelect(option.value)}
                    variant="outline"
                    className={cn(
                      "px-4 py-2 rounded-[10px] border border-black/20 font-semibold transition-all duration-200",
                      selectedStatus === option.value
                        ? "bg-white text-black border-black/20"
                        : "bg-white text-black/80 hover:bg-black hover:text-white"
                    )}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>

              {/* Search Input - Positioned at rightmost with animation */}
              <div className="ml-auto">
                <SearchInput
                  onSearch={handleSearch}
                  className={cn(
                    "transition-all duration-300 ease-in-out",
                    isExpanded ? "w-80" : "w-96" // Wider when sidebar is collapsed
                  )}
                />
              </div>
            </div>
          </div>

          {/* Class List Container - Full width and height */}
          <div className="flex-1 overflow-hidden">
            <ClassList classes={classListMockData} maxClasses={8} />
          </div>
        </div>
      </div>
    </div>
  );
};



// Main wrapper component that provides sidebar context
const HomescreenPage: React.FC<HomescreenPageProps> = ({ className }) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <HomescreenPageContent className={className} />
    </SidebarProvider>
  );
};

export default HomescreenPage;
