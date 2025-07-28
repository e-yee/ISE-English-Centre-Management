import React from "react";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import ProfileCard from "@/components/profile/ProfileCard";

interface ProfileSettingPageProps {
  className?: string;
}

// Internal component that uses the sidebar context
const ProfileSettingPageContent: React.FC<ProfileSettingPageProps> = ({ className }) => {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";

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
          {/* Profile Content Container */}
          <div className={cn(
            "flex-1 transition-all duration-300 ease-in-out flex items-center justify-center",
            "px-4 py-6"
          )}>
            {/* Profile Card */}
            <div className="w-full max-w-6xl mx-auto">
              <ProfileCard className="w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main wrapper component that provides sidebar context
const ProfileSettingPage: React.FC<ProfileSettingPageProps> = ({ className }) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <ProfileSettingPageContent className={className} />
    </SidebarProvider>
  );
};

export default ProfileSettingPage; 