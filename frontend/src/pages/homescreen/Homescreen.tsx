import React, { useState } from "react";
import { cn } from "@/lib/utils";
import ClassList from "@/components/class/ClassList";
import { SearchInput } from "@/components/ui/SearchInput";
import { Button } from "@/components/ui/button";
import { classListMockData } from "@/mockData/classListMock";

interface HomescreenPageProps {
  className?: string;
}

const HomescreenPage: React.FC<HomescreenPageProps> = ({ className }) => {
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
    <div className={cn("h-full overflow-hidden flex flex-col", className)}>
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
              className="w-80"
            />
          </div>
        </div>
      </div>

      {/* Class List Container - Full width and height */}
      <div className="flex-1 overflow-hidden">
        <ClassList classes={classListMockData} maxClasses={8} />
      </div>
    </div>
  );
};

export default HomescreenPage;
