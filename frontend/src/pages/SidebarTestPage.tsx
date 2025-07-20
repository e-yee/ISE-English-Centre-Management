import React from "react";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/Header";
import MainSidebar from "@/components/layout/Sidebar";
import ClassList from "@/components/layout/ClassList";
import FeatureBar from "@/components/layout/FeatureBar";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { classListMockData } from "@/mockData/classListMock";

interface SidebarTestPageProps {
  className?: string;
}

// Internal component that uses the sidebar context
const SidebarTestPageContent: React.FC<SidebarTestPageProps> = ({ className }) => {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";

  return (
    <div className={cn("min-h-screen bg-gray-50", className)}>
      {/* Header - Always at top */}
      <Header isRegistered={true} />

      {/* Sidebar - Fixed position, only shown for registered users */}
      <MainSidebar />

      {/* Main Content Area */}
      <div className="relative">
        {/* Content container with sidebar spacing */}
        <div className={cn(
          "transition-all duration-300 ease-in-out",
          isExpanded ? "ml-[295px]" : "ml-20"
        )}>
          {/* Feature Bar Container - Positioned under header, aligned with left side of ClassList */}
          <div className="pt-6 pb-4">
            {/* Container to align with ClassList */}
            <div className={cn(
              "flex justify-center transition-all duration-300 ease-in-out",
              isExpanded ? "pl-8" : "pl-4"
            )}>
              {/* Feature Bar - Positioned to align with left side of ClassList */}
              <div className="max-w-6xl w-full flex justify-start">
                <FeatureBar className={cn(
                  "transition-all duration-300 ease-in-out",
                  isExpanded ? "ml-0" : "ml-4"
                )} />
              </div>
            </div>
          </div>

          {/* Class List Container - Full width and height */}
          <div className="flex-1 flex overflow-hidden pb-4">
            {/* Left padding spacer - matches feature bar alignment */}
            <div className={cn(
              "flex-shrink-0 transition-all duration-300 ease-in-out",
              isExpanded ? "w-8" : "w-4"
            )}></div>

            {/* Class List - extends to right edge, matches FeatureBar width */}
            <div className="flex-1 overflow-hidden">
              <div className="max-w-6xl mx-auto">
                <ClassList
                  classes={classListMockData}
                  className={cn(
                    "transition-all duration-300 ease-in-out",
                    isExpanded ? "mx-0" : "mx-4"
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main wrapper component that provides sidebar context
const SidebarTestPage: React.FC<SidebarTestPageProps> = ({ className }) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <SidebarTestPageContent className={className} />
    </SidebarProvider>
  );
};

export default SidebarTestPage;
