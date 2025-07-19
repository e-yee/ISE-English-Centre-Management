import React from "react";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";

interface ExamplePageProps {
  className?: string;
}

// Internal component that uses the sidebar context
const ExamplePageContent: React.FC<ExamplePageProps> = ({ className }) => {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";

  return (
    <div className={cn("h-screen w-screen bg-gray-50 overflow-hidden", className)}>
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
          "h-full pt-8 pl-8 transition-all duration-300 ease-in-out overflow-hidden",
          isExpanded ? "ml-[335px]" : "ml-[120px]" // Space for sidebar + toggle button
        )}>
          {/* Scrollable content container */}
          <div className="h-full overflow-y-auto custom-scrollbar">
            <h1 className="text-2xl font-bold">Sidebar Test Page</h1>
            <p className="mt-4">
              This page is for testing the new shadcn/ui sidebar implementation.
            </p>
            <p className="mt-2">
              Sidebar state: {state} ({isExpanded ? "295px" : "80px"} width)
            </p>
            <p className="mt-2 text-sm text-gray-600">
              ✅ Position: Sidebar touches bottom of header<br/>
              ✅ Layout: Full page height and width<br/>
              ✅ Toggle: Outside sidebar, aligned with dashboard<br/>
              ✅ Tooltips: Only on hover in collapsed state<br/>
              ✅ Tooltip style: White background with arrow pointer<br/>
              ✅ No main page scrollbar - only internal content scrolling
            </p>

            {/* Add some content to test scrolling */}
            <div className="mt-8 space-y-4 pb-8">
              {Array.from({ length: 20 }, (_, i) => (
                <div key={i} className="p-4 bg-white rounded-lg shadow">
                  <h3 className="font-semibold">Test Content {i + 1}</h3>
                  <p className="text-gray-600">This is test content to demonstrate internal content scrolling without main page scrollbar.</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main wrapper component that provides sidebar context
const ExamplePage: React.FC<ExamplePageProps> = ({ className }) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <ExamplePageContent className={className} />
    </SidebarProvider>
  );
};

export default ExamplePage;
