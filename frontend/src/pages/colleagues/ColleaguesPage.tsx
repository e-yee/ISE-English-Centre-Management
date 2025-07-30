import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import ColleagueList from "@/components/colleagues/ColleagueList";
import ColleagueProfilePanel from "@/components/colleagues/ColleagueProfilePanel";
import { colleaguesMock } from "@/mockData/colleaguesMock";

interface ColleaguesPageProps {
  className?: string;
}

// Internal component that uses the sidebar context
const ColleaguesPageContent: React.FC<ColleaguesPageProps> = ({ className }) => {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";
  // Set selectedColleagueId to null by default
  const [selectedColleagueId, setSelectedColleagueId] = useState<string | null>(null);

  const selectedColleague = colleaguesMock.find(c => c.id === selectedColleagueId);

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

        {/* Content area - positioned to start from bottom of header */}
        <div className={cn(
          "absolute top-4 left-0 right-0 bottom-0 transition-all duration-300 ease-in-out overflow-hidden",
          isExpanded ? "ml-[335px]" : "ml-[120px]"
        )}>
          {/* Main two-pane content - positioned to fit with header */}
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
                colleagues={colleaguesMock}
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
      </div>
    </div>
  );
};

// Main wrapper component that provides sidebar context
const ColleaguesPage: React.FC<ColleaguesPageProps> = ({ className }) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <ColleaguesPageContent className={className} />
    </SidebarProvider>
  );
};

export default ColleaguesPage; 