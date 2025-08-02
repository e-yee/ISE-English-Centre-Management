import React, { useState } from "react";
import { cn } from "@/lib/utils";
import ColleagueList from "@/components/colleagues/ColleagueList";
import ColleagueProfilePanel from "@/components/colleagues/ColleagueProfilePanel";
import { useEmployees } from "@/hooks/entities/useEmployees";
import type { Colleague } from "@/mockData/colleaguesMock";

interface ColleaguesPageProps {
  className?: string;
}

const ColleaguesPage: React.FC<ColleaguesPageProps> = ({ className }) => {
  const [selectedColleagueId, setSelectedColleagueId] = useState<string | null>(null);

  // Use the employees hook instead of mock data
  const { data: employees, isLoading, error, refetch } = useEmployees();
  console.log("employees", employees);

  // Transform Employee data to match Colleague interface
  const colleagues: Colleague[] = (employees || []).map(employee => ({
    id: employee.id,
    name: employee.name || employee.full_name,
    email: employee.email,
    phone: employee.phone || employee.phone_number,
    avatar: employee.avatar || '/default-avatar.png',
    nickname: employee.nickname || '',
    achievements: employee.achievements?.join(', ') || '',
    philosophy: employee.philosophy || '',
    courses: employee.courses?.map((course, index) => ({
      id: `C${index + 1}`,
      name: course,
      time: 'TBD'
    })) || []
  }));

  const selectedColleague = colleagues.find(c => c.id === selectedColleagueId);

  // Loading state
  if (isLoading) {
    return (
      <div className={cn("h-full flex items-center justify-center", className)}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading colleagues...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={cn("h-full flex items-center justify-center", className)}>
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">Error: {error.message}</p>
          <button 
            onClick={() => refetch()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("h-full overflow-hidden", className)}>
      {/* Main two-pane content */}
      <div className={cn(
        "h-full flex transition-all duration-500 ease-in-out",
        selectedColleagueId ? "detail-view-active" : ""
      )}>
        {/* Colleague List - Expands to full width when no profile selected */}
        <div className={cn(
          "bg-white transition-all duration-500 ease-in-out flex-grow",
          selectedColleagueId ? "w-[40%] border-r border-gray-200" : "w-full"
        )}>
          <ColleagueList
            colleagues={colleagues}
            selectedColleagueId={selectedColleagueId}
            onSelect={setSelectedColleagueId}
          />
        </div>

        {/* Profile Panel - Fixed width, slides in/out */}
        <div className={cn(
          "w-[60%] transition-all duration-500 ease-in-out absolute right-0 top-0 bottom-0 bg-white",
          selectedColleagueId ? "translate-x-0" : "translate-x-full pointer-events-none"
        )}>
          {selectedColleague && (
            <ColleagueProfilePanel
              colleague={selectedColleague}
              onMinimize={() => setSelectedColleagueId(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ColleaguesPage; 