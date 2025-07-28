import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import AuthPageDemo from "@/components/demo/AuthPageDemo";
import HomescreenDemo from "@/components/demo/HomescreenDemo";
import ClassScreenDemo from "@/components/demo/ClassScreenDemo";
import ClassInformationDemo from "@/components/demo/ClassInformationDemo";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import ClassScreen from "./class/ClassScreen";
import AddMaterialsDemo from "@/components/demo/AddMaterialsDemo";
import ProfileSettingPage from "./profile/ProfileSettingPage";
import AbsentRequestPage from "./absent-request/AbsentRequestPage";

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
  const [showClassInformationDemo, setShowClassInformationDemo] = useState(false);
  const [showAddMaterialsDemo, setShowAddMaterialsDemo] = useState(false);
  const [showProfileSettingDemo, setShowProfileSettingDemo] = useState(false);
  const [showAbsentRequestDemo, setShowAbsentRequestDemo] = useState(false);

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

  // If showing class information demo, render it instead of the example content
  if (showClassInformationDemo) {
    return (
      <div className="relative">
        {/* Back button overlay */}
        <div className="absolute bottom-4 left-4 z-50">
          <Button
            onClick={() => setShowClassInformationDemo(false)}
            variant="outline"
            className="bg-white/90 backdrop-blur-sm border-2 border-black hover:bg-gray-100 font-semibold"
          >
            ← Back to Example
          </Button>
        </div>
        <ClassInformationDemo />
      </div>
    );
  }

  if (showAddMaterialsDemo) {
    return (
      <div className="relative">
        {/* Back button overlay */}
        <div className="absolute bottom-4 left-4 z-50">
          <Button
            onClick={() => setShowAddMaterialsDemo(false)}
            variant="outline"
            className="bg-white/90 backdrop-blur-sm border-2 border-black hover:bg-gray-100 font-semibold"
          >
            ← Back to Example
          </Button>
        </div>
        <AddMaterialsDemo />
      </div>
    );
  }

  if (showProfileSettingDemo) {
    return (
      <div className="relative">
        {/* Back button overlay */}
        <div className="absolute bottom-4 left-4 z-50">
          <Button
            onClick={() => setShowProfileSettingDemo(false)}
            variant="outline"
            className="bg-white/90 backdrop-blur-sm border-2 border-black hover:bg-gray-100 font-semibold"
          >
            ← Back to Example
          </Button>
        </div>
        <ProfileSettingPage />
      </div>
    );
  }

  if (showAbsentRequestDemo) {
    return (
      <div className="relative">
        {/* Back button overlay */}
        <div className="absolute bottom-4 left-4 z-50">
          <Button
            onClick={() => setShowAbsentRequestDemo(false)}
            variant="outline"
            className="bg-white/90 backdrop-blur-sm border-2 border-black hover:bg-gray-100 font-semibold"
          >
            ← Back to Example
          </Button>
        </div>
        <AbsentRequestPage />
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

            {/* Class Information Demo Button */}
            <div className="mt-6 p-6 bg-white rounded-lg shadow-lg border-2 border-purple-200">
              <h2 className="text-xl font-semibold mb-4">📋 Class Information Demo - Glassmorphism Card Layout</h2>
              <p className="text-gray-600 mb-4">
                View the new class information page with glassmorphism card design featuring expanded class details,
                student count, dates, room/time information, and progress tracking. Includes function buttons for
                class management actions.
              </p>
              <p className="text-sm text-purple-600 mb-4">
                <strong>✨ New Features:</strong> Glassmorphism styling with semi-transparent background, gradient borders,
                backdrop blur effects, icon integration for calendar/clock/location, and reused progress bar styling.
              </p>
              <Button
                onClick={() => setShowClassInformationDemo(true)}
                className="bg-[#AB2BAF] hover:bg-[#471249] text-white px-6 py-3 rounded-[30px] border-2 border-black font-semibold transition-all duration-200"
              >
                🎨 View Class Information Demo
              </Button>
            </div>

            {/* Add Materials Demo Button */}
            <div className="mt-6 p-6 bg-white rounded-lg shadow-lg border-2 border-yellow-200">
              <h2 className="text-xl font-semibold mb-4">📂 File Management Demo - Materials Page</h2>
              <p className="text-gray-600 mb-4">
                View the new materials management page, featuring list, grid, and tree views,
                drag-and-drop uploads, and a Google Drive-style upload toast notification.
              </p>
              <p className="text-sm text-yellow-600 mb-4">
                <strong>✨ New Features:</strong> View switcher, file/folder creation, and real-time upload progress.
              </p>
              <Button
                onClick={() => setShowAddMaterialsDemo(true)}
                className="bg-[#F8D222] hover:bg-[#E2BE1B] text-black px-6 py-3 rounded-[30px] border-2 border-black font-semibold transition-all duration-200"
              >
                📂 View Materials Demo
              </Button>
            </div>

            {/* Profile Setting Demo Button */}
            <div className="mt-6 p-6 bg-white rounded-lg shadow-lg border-2 border-blue-200">
              <h2 className="text-xl font-semibold mb-4">👤 Profile Setting Demo - User Profile Management</h2>
              <p className="text-gray-600 mb-4">
                View the new profile settings page with editable user information, contact management,
                and responsive design that matches the Figma specifications.
              </p>
              <p className="text-sm text-blue-600 mb-4">
                <strong>✨ New Features:</strong> Editable fields (nickname, philosophy, achievements),
                contact section with email display, and responsive layout with sidebar integration.
              </p>
              <Button
                onClick={() => setShowProfileSettingDemo(true)}
                className="bg-[#4A90E2] hover:bg-[#357ABD] text-white px-6 py-3 rounded-[30px] border-2 border-black font-semibold transition-all duration-200"
              >
                👤 View Profile Setting Demo
              </Button>
            </div>

            {/* Absent Request Demo Button */}
            <div className="mt-6 p-6 bg-white rounded-lg shadow-lg border-2 border-red-200">
              <h2 className="text-xl font-semibold mb-4">📝 Absent Request Demo - Absence Form</h2>
              <p className="text-gray-600 mb-4">
                View the new absent request page with a form for submitting absence requests,
                including date pickers and a textarea for notes.
              </p>
              <p className="text-sm text-red-600 mb-4">
                <strong>✨ New Features:</strong> Date pickers with popover calendars,
                a reusable textarea component, and a clean form layout.
              </p>
              <Button
                onClick={() => setShowAbsentRequestDemo(true)}
                className="bg-[#E2445C] hover:bg-[#C73349] text-white px-6 py-3 rounded-[30px] border-2 border-black font-semibold transition-all duration-200"
              >
                📝 View Absent Request Demo
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
