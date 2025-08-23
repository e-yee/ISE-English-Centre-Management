import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import ClassList from "@/components/class/ClassList";
import { SearchInput } from "@/components/ui/SearchInput";
import { Button } from "@/components/ui/button";
import { useClasses } from "@/hooks/entities/useClasses";
import type { ClassData, BackendClassData } from "@/types/class";
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
    className: `Class ${classItem.id}`,
    courseId: classItem.course_id,
    room: classItem.room?.name || classItem.room_id || 'Unknown Room',
    time: classDate.toTimeString().split(' ')[0],
    status,
    statusColor
  };
};

const HomescreenPage: React.FC<HomescreenPageProps> = ({ className }) => {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const { data: classes, isLoading, error } = useClasses();

  // Transform backend data to frontend format with proper type checking
  const transformedClasses: ClassData[] = React.useMemo(() => {
    if (!classes || !Array.isArray(classes)) {
      return [];
    }
    
    try {
      return classes.map(transformClassToClassData);
    } catch (error) {
      console.error('❌ Error transforming classes:', error);
      return [];
    }
  }, [classes]);

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

  const handleClassClick = (item: ClassData) => {
    // Match by both class id and course id to avoid cross-course collisions
    const original = (classes || []).find(
      (c: any) => c.id === item.id && c.course_id === item.courseId
    ) as Class | undefined;
    const cid = original?.course_id || item.courseId;
    const cdate = original?.course_date || '';
    const term = original?.term != null ? String(original.term) : '';
    navigate(`/class/${item.id}?courseId=${encodeURIComponent(cid)}&courseDate=${encodeURIComponent(cdate)}&term=${encodeURIComponent(term)}`);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className={cn("h-full overflow-hidden flex flex-col", className)}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-600 mb-2">Loading Classes...</div>
            <div className="text-gray-500">Please wait while we fetch your classes.</div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={cn("h-full overflow-hidden flex flex-col", className)}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-2xl font-semibold text-red-600 mb-2">Error Loading Classes</div>
            <div className="text-gray-500">Failed to load classes. Please try again later.</div>
            <div className="text-sm text-gray-400 mt-2">Error: {error.message}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("h-full overflow-hidden flex flex-col", className)}>
      {/* Filter Controls Container */}
      <div className={cn(
        "pt-3 pb-3 flex-shrink-0 transition-all duration-300 ease-in-out",
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
                  "h-8",
                  "px-4",
                  "rounded-[10px] ",
                  "font-semibold ",
                  "transition-all duration-200",
                  selectedStatus === option.value
                    ? "bg-gradient-to-r from-[#b597f6] to-[#96c6ea] text-white hover:text-white select-none"
                    : "cursor-pointer bg-white hover:bg-[#223A5E] hover:text-white hover:scale-[110%] border border-black/20"
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
              className="w-[100%] h-8"
            />
          </div>
        </div>
      </div>

      {/* Class List Container - Full width and height */}
      <div className="flex-1 overflow-hidden">
        {transformedClasses.length > 0 ? (
          <ClassList 
            classes={transformedClasses} 
            maxClasses={8} 
            onClassClick={handleClassClick}
          />
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
