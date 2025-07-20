import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import AuthPageDemo from "@/components/demo/AuthPageDemo";
import HomescreenDemo from "@/components/demo/HomescreenDemo";
import ClassScreenDemo from "@/components/demo/ClassScreenDemo";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import ClassScreen from "./class/ClassScreen";

interface ExamplePageProps {
  className?: string;
}

// Internal component that uses the sidebar context
const ExamplePageContent: React.FC<ExamplePageProps> = ({ className }) => {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";
  const [showAuthPage, setShowAuthPage] = useState(false);
  const [showHomescreenDemo, setShowHomescreenDemo] = useState(false);
  const [showClassScreenDemo, setShowClassScreenDemo] = useState(false);

  // If showing homescreen demo, render it instead of the example content
  if (showHomescreenDemo) {
    return (
      <div className="relative">
        {/* Back button overlay */}
        <div className="absolute bottom-4 left-4 z-50">
          <Button
            onClick={() => setShowHomescreenDemo(false)}
            variant="outline"
            className="bg-white/90 backdrop-blur-sm border-2 border-black hover:bg-gray-100 font-semibold"
          >
            ← Back to Example
          </Button>
        </div>
        <HomescreenDemo />
      </div>
    );
  }

  // If showing class screen demo, render it instead of the example content
  if (showClassScreenDemo) {
    return (
      <div className="relative">
        {/* Back button overlay */}
        <div className="absolute bottom-4 left-4 z-50">
          <Button
            onClick={() => setShowClassScreenDemo(false)}
            variant="outline"
            className="bg-white/90 backdrop-blur-sm border-2 border-black hover:bg-gray-100 font-semibold"
          >
            ← Back to Example
          </Button>
        </div>
        <ClassScreenDemo />
      </div>
    );
  }

  // If showing auth page, render it instead of the example content
  if (showAuthPage) {
    return (
      <div className="relative">
        {/* Back button overlay */}
        <div className="absolute top-4 left-4 z-50">
          <Button
            onClick={() => setShowAuthPage(false)}
            variant="outline"
            className="bg-white/90 backdrop-blur-sm border-2 border-black hover:bg-gray-100 font-semibold"
          >
            ← Back to Example
          </Button>
        </div>
        <AuthPageDemo />
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold text-gray-800">🧪 Component & Page Test Center</h1>
            <p className="mt-4 text-lg text-gray-600">
              Comprehensive testing environment for all pages, components, and UI elements in the ISE English Centre Management System.
            </p>

            {/* Current Layout Status */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">📊 Current Layout Status</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Sidebar:</strong> {state} ({isExpanded ? "295px" : "80px"} width)</p>
                  <p><strong>Header:</strong> Fixed 80px height</p>
                  <p><strong>Layout:</strong> Responsive viewport-contained</p>
                </div>
                <div>
                  <p>✅ Sidebar positioning & animations</p>
                  <p>✅ Header integration</p>
                  <p>✅ Custom scrollbars</p>
                  <p>✅ Tooltip system</p>
                </div>
              </div>
            </div>

            {/* Homescreen Redesign Demo Button */}
            <div className="mt-8 p-6 bg-white rounded-lg shadow-lg border-2 border-green-200">
              <h2 className="text-xl font-semibold mb-4">🏠 Homescreen Redesign Demo - New Card Layout</h2>
              <p className="text-gray-600 mb-4">
                View the redesigned homescreen with new class card layout using shadcn/ui Card components,
                updated search input styling (10px border radius), transparent containers, and improved status buttons
                with black hover effects. Features new icons for calendar, location, time, and navigation.
              </p>
              <p className="text-sm text-green-600 mb-4">
                <strong>✨ New Features:</strong> Card-based class components, separator components for visual hierarchy,
                responsive design, and Figma-compliant styling updates.
              </p>
              <Button
                onClick={() => setShowHomescreenDemo(true)}
                className="bg-[#22E2F8] hover:bg-[#1BC7DC] text-black px-6 py-3 rounded-[30px] border-2 border-black font-semibold transition-all duration-200"
              >
                🚀 View Homescreen Redesign Demo
              </Button>
            </div>

            {/* Auth Page Demo Button */}
            <div className="mt-6 p-6 bg-white rounded-lg shadow-lg border-2 border-gray-200">
              <h2 className="text-xl font-semibold mb-4">🎨 Auth Page Demo - Full Screen Split Layout</h2>
              <p className="text-gray-600 mb-4">
                View the redesigned authentication forms in full-screen split layout: form on the left half,
                classroom image on the right half. Matches Figma design specifications with mock functionality.
              </p>
              <p className="text-sm text-blue-600 mb-4">
                <strong>Note:</strong> The main AuthPage (with router logic) has been updated to match this design.
                Switch to AuthPage in App.tsx to see the router-enabled version.
              </p>
              <Button
                onClick={() => setShowAuthPage(true)}
                className="bg-[#7181DD] hover:bg-[#5A6ACF] text-white px-6 py-3 rounded-[30px] border-2 border-black font-semibold transition-all duration-200"
              >
                🚀 View Full-Screen Auth Demo
              </Button>
            </div>

            {/* Class Screen Demo Button */}
            <div className="mt-6 p-6 bg-white rounded-lg shadow-lg border-2 border-gray-200">
              <h2 className="text-xl font-semibold mb-4">📚 Class Screen Demo - Student Management</h2>
              <p className="text-gray-600 mb-4">
                View the new class screen implementation with feature buttons, class information, and always-expanded student cards.
                Includes RevealOnScroll animations, updated styling to match Figma specifications, and responsive sidebar integration.
              </p>
              <p className="text-sm text-green-600 mb-4">
                <strong>✨ New Features:</strong> FeatureButtonList, ClassInfo component, white student cards with 15px border radius,
                always-expanded StudentInfo sections, and fade-up animations for student list.
              </p>
              <Button
                onClick={() => setShowClassScreenDemo(true)}
                className="bg-[#22E2F8] hover:bg-[#1BC7DC] text-black px-6 py-3 rounded-[30px] border-2 border-black font-semibold transition-all duration-200"
              >
                📚 View Class Screen Demo
              </Button>
            </div>

            {/* Additional Demo Options */}
            <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-3">📋 Other Demo Pages</h3>
              <p className="text-gray-600 mb-4">
                Switch between different page demos by uncommenting them in App.tsx:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• HomescreenPage - Main dashboard with class list</li>
                <li>• ClassScreen - Individual class management (now available as demo above)</li>
                <li>• SidebarTestPage - Sidebar component testing</li>
                <li>• AuthPage - Authentication forms (redesigned)</li>
              </ul>
            </div>

            {/* Add some content to test scrolling with reveal animation */}
            <div className="mt-8 space-y-4 pb-8">
              {Array.from({ length: 15 }, (_, i) => (
                <RevealOnScroll
                  key={i}
                  delay={i * 50}
                  variant="fade-up"
                >
                  <div className="p-4 bg-white rounded-lg shadow">
                    <h3 className="font-semibold">Test Content {i + 1}</h3>
                    <p className="text-gray-600">This is test content to demonstrate internal content scrolling without main page scrollbar and reveal on scroll animations.</p>
                  </div>
                </RevealOnScroll>
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
