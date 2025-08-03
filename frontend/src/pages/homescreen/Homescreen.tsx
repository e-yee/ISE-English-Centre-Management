import React, { useState } from "react";
import { cn } from "@/lib/utils";
import ClassList from "@/components/class/ClassList";
import { SearchInput } from "@/components/ui/SearchInput";
import { Button } from "@/components/ui/button";
import { useClasses } from "@/hooks/entities/useClasses";
import type { ClassData } from "@/mockData/classListMock";
import type { Class } from "@/services/entities/classService";

interface HomescreenPageProps {
  className?: string;
}

// Transform backend Class to frontend ClassData
const transformClassToClassData = (classItem: Class): ClassData => {
  const classDate = new Date(classItem.class_date);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Determine status based on date
  let status: 'Today' | 'Tomorrow' | 'Coming soon' | 'Expired' | string = 'Coming soon';
  let statusColor: 'today' | 'tomorrow' | 'coming-soon' | 'expired' | 'custom' = 'coming-soon';
  
  const classDateOnly = new Date(classDate.getFullYear(), classDate.getMonth(), classDate.getDate());
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
  
  if (classDateOnly.getTime() === todayOnly.getTime()) {
    status = 'Today';
    statusColor = 'today';
  } else if (classDateOnly.getTime() === tomorrowOnly.getTime()) {
    status = 'Tomorrow';
    statusColor = 'tomorrow';
  } else if (classDate < today) {
    status = 'Expired';
    statusColor = 'expired';
  }
  
  return {
    id: classItem.id,
    className: `${classItem.term}.Class ${classItem.id}`,
    room: classItem.room_id,
    time: classDate.toTimeString().split(' ')[0],
    startDate: classDate.toLocaleDateString('en-GB'),
    endDate: new Date(classDate.getTime() + 60 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB'), // +60 days
    status,
    statusColor,
    progress: Math.floor(Math.random() * 100) // Random progress for now
  };
};

const HomescreenPage: React.FC<HomescreenPageProps> = ({ className }) => {
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const { data: classes } = useClasses();
  console.log('class entered');
  // Transform backend data to frontend format
  const transformedClasses: ClassData[] = classes ? classes.map(transformClassToClassData) : [];
  
  console.log('🔍 Original classes:', classes);
  console.log('🔍 Transformed classes:', transformedClasses);

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
        {transformedClasses.length > 0 ? (
          <ClassList classes={transformedClasses} maxClasses={8} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-600 mb-2">No Classes Found</div>
              <div className="text-gray-500">There are no classes available at the moment.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomescreenPage;
