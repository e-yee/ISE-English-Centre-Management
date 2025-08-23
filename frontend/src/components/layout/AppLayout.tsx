import React from "react";
import { Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";

// Internal component that uses the sidebar context
const AppLayoutContent: React.FC = () => {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";

  return (
    <div className="relative h-screen w-screen bg-gray-50 overflow-hidden font-comfortaa">
      {/* Header - Always at top, full width */}
      <div className="absolute top-0 left-0 w-full h-20 z-50">
        <Header isRegistered={true} />
      </div>

      {/* Main content area with sidebar */}
      <div className="relative h-screen">
        {/* Sidebar - positioned to start below header and fill to bottom */}
        <div className="absolute top-16 left-0 bottom-0">
          <Sidebar />
        </div>

        {/* Content area - positioned to start from bottom of header */}
        <div className={cn(
          "absolute top-20 left-0 right-0 bottom-0 transition-all duration-300 ease-in-out overflow-hidden",
          isExpanded ? "ml-[335px]" : "ml-[120px]"
        )}>
          {/* Page content renders here via Outlet */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

// Main wrapper component that provides sidebar context
const AppLayout: React.FC = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppLayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout; 