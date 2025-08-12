import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import AuthPage from "./auth/AuthPage";
import ClassInformationPage from "./class/ClassInformationPage";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import ClassScreen from "./class/ClassScreen";
import AddMaterialsPage from "./materials/AddMaterialsPage";
import ProfileSettingPage from "./profile/ProfileSettingPage";
import AbsentRequestPage from "./absent-request/AbsentRequestPage";
import AttendancePage from "./attendance/AttendancePage";
import DevelopmentProgressList from "@/components/demo/DevelopmentProgressList";
import ClassReportPage from "./class-report/ClassReportPage";
import TimeKeepingPage from "./timekeeping/TimeKeeping";
import CheckInPage from "./timekeeping/CheckInPage";
import TimeEntriesPage from "./timekeeping/TimeEntriesPage";
import { List, Grid3X3 } from "lucide-react";
import ColleaguesPage from "./colleagues/ColleaguesPage";
import HomescreenPage from "./homescreen/Homescreen";

interface ExamplePageProps {
  className?: string;
}

// Development progress data (legacy; kept for reference but unused)
/* const developmentItems = [
  {
    id: "homescreen",
    name: "Homescreen",
    description: "Main dashboard with class list and card layout",
    status: "completed" as const,
    priority: "high" as const,
    category: "Pages",
    lastUpdated: "2024-01-15",
    demoAvailable: true,
    demoComponent: HomescreenPage
  },
  {
    id: "auth-page",
    name: "Auth Page",
    description: "Authentication forms with split layout design",
    status: "completed" as const,
    priority: "high" as const,
    category: "Pages",
    lastUpdated: "2024-01-14",
    demoAvailable: true,
    demoComponent: AuthPage
  },
  {
    id: "class-screen",
    name: "Class Screen",
    description: "Individual class management with student list",
    status: "completed" as const,
    priority: "high" as const,
    category: "Pages",
    lastUpdated: "2024-01-13",
    demoAvailable: true,
    demoComponent: ClassScreen
  },
  {
    id: "class-information",
    name: "Class Information",
    description: "Glassmorphism card layout for class details",
    status: "completed" as const,
    priority: "medium" as const,
    category: "Components",
    lastUpdated: "2024-01-12",
    demoAvailable: true,
    demoComponent: ClassInformationPage
  },
  {
    id: "materials-page",
    name: "Materials Page",
    description: "File management with list/grid/tree views",
    status: "completed" as const,
    priority: "medium" as const,
    category: "Pages",
    lastUpdated: "2024-01-11",
    demoAvailable: true,
    demoComponent: AddMaterialsPage
  },
  {
    id: "profile-settings",
    name: "Profile Settings",
    description: "User profile management and editing",
    status: "completed" as const,
    priority: "medium" as const,
    category: "Pages",
    lastUpdated: "2024-01-10",
    demoAvailable: true,
    demoComponent: ProfileSettingPage
  },
  {
    id: "absent-request",
    name: "Absent Request",
    description: "Absence request form with date pickers",
    status: "completed" as const,
    priority: "low" as const,
    category: "Pages",
    lastUpdated: "2024-01-09",
    demoAvailable: true,
    demoComponent: AbsentRequestPage
  },
  {
    id: "attendance-page",
    name: "Student Attendance",
    description: "Teacher attendance tracking with student cards and statistics",
    status: "completed" as const,
    priority: "high" as const,
    category: "Pages",
    lastUpdated: "2024-01-16",
    demoAvailable: true,
    demoComponent: AttendancePage
  },
  {
    id: "class-report",
    name: "Class Report",
    description: "Class report page with student scores and teacher assessments",
    status: "completed" as const,
    priority: "high" as const,
    category: "Pages",
    lastUpdated: "2024-01-17",
    demoAvailable: true,
    demoComponent: ClassReportPage
  },
  {
    id: "timekeeping-page",
    name: "Timekeeping",
    description: "Timekeeping interface with check-in and recent time entries tracking",
    status: "completed" as const,
    priority: "medium" as const,
    category: "Pages",
    lastUpdated: "2024-01-18",
    demoAvailable: true,
    demoComponent: TimeKeepingPage
  },
  {
    id: "checkin-page",
    name: "Check In",
    description: "Check-in page with statistics, upcoming classes, and check-in functionality",
    status: "completed" as const,
    priority: "high" as const,
    category: "Pages",
    lastUpdated: "2024-01-19",
    demoAvailable: true,
    demoComponent: CheckInPage
  },
  {
    id: "time-entries-page",
    name: "Time Entries",
    description: "Recent time entries page with two-column layout and notification card",
    status: "completed" as const,
    priority: "medium" as const,
    category: "Pages",
    lastUpdated: "2024-01-20",
    demoAvailable: true,
    demoComponent: TimeEntriesPage
  },
  {
    id: "class-report",
    name: "Class Report",
    description: "Class report page with student scores and teacher assessments",
    status: "completed" as const,
    priority: "high" as const,
    category: "Pages",
    lastUpdated: "2024-01-17",
    demoAvailable: true,
    demoComponent: ClassReportPage
  },
  {
    id: "sidebar",
    name: "Sidebar Navigation",
    description: "Collapsible sidebar with navigation items",
    status: "completed" as const,
    priority: "high" as const,
    category: "Components",
    lastUpdated: "2024-01-08",
    demoAvailable: false
  },
  {
    id: "header",
    name: "Header Component",
    description: "Top navigation bar with user controls",
    status: "completed" as const,
    priority: "high" as const,
    category: "Components",
    lastUpdated: "2024-01-07",
    demoAvailable: false
  },
  {
    id: "student-management",
    name: "Student Management",
    description: "Student CRUD operations and attendance tracking",
    status: "in-progress" as const,
    priority: "high" as const,
    category: "Features",
    lastUpdated: "2024-01-16",
    demoAvailable: false
  },
  {
    id: "teacher-dashboard",
    name: "Teacher Dashboard",
    description: "Teacher-specific dashboard and tools",
    status: "pending" as const,
    priority: "medium" as const,
    category: "Pages",
    lastUpdated: "2024-01-15",
    demoAvailable: false
  },
  {
    id: "admin-panel",
    name: "Admin Panel",
    description: "Administrative tools and user management",
    status: "pending" as const,
    priority: "low" as const,
    category: "Pages",
    lastUpdated: "2024-01-14",
    demoAvailable: false
  },
  {
    id: "colleagues",
    name: "Colleagues",
    description: "Staff directory with searchable list and profile panel",
    status: "completed" as const,
    priority: "high" as const,
    category: "Pages",
    lastUpdated: "2024-01-21",
    demoAvailable: true,
    demoComponent: ColleaguesPage
  }
]; */

// Internal component that uses the sidebar context
const ExamplePageContent: React.FC<ExamplePageProps> = ({ className }) => {
  const [showAuthPage, setShowAuthPage] = useState(false);
  const [showHomescreenDemo, setShowHomescreenDemo] = useState(false);
  const [showClassScreenDemo, setShowClassScreenDemo] = useState(false);
  const [showClassInformationDemo, setShowClassInformationDemo] = useState(false);
  const [showAddMaterialsDemo, setShowAddMaterialsDemo] = useState(false);
  const [showProfileSettingDemo, setShowProfileSettingDemo] = useState(false);
  const [showAbsentRequestDemo, setShowAbsentRequestDemo] = useState(false);
  const [showAttendancePageDemo, setShowAttendancePageDemo] = useState(false);
  const [showClassReportDemo, setShowClassReportDemo] = useState(false);
  const [showTimekeepingDemo, setShowTimekeepingDemo] = useState(false);
  const [showCheckInDemo, setShowCheckInDemo] = useState(false);
  const [showTimeEntriesDemo, setShowTimeEntriesDemo] = useState(false);
  const [showColleaguesDemo, setShowColleaguesDemo] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');

  // Handle demo viewing from list (legacy wiring removed)
  // const handleViewDemo = (item: any) => { };

  // const handleViewDetails = (item: any) => {};

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
        <HomescreenPage />
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
        <ClassScreen />
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
        <ClassInformationPage />
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
        <AddMaterialsPage />
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

  if (showAttendancePageDemo) {
    return (
      <div className="relative">
        {/* Back button overlay */}
        <div className="absolute bottom-4 left-4 z-50">
          <Button
            onClick={() => setShowAttendancePageDemo(false)}
            variant="outline"
            className="bg-white/90 backdrop-blur-sm border-2 border-black hover:bg-gray-100 font-semibold"
          >
            ← Back to Example
          </Button>
        </div>
        <AttendancePage />
      </div>
    );
  }

  if (showClassReportDemo) {
    return (
      <div className="relative">
        {/* Back button overlay */}
        <div className="absolute bottom-4 left-4 z-50">
          <Button
            onClick={() => setShowClassReportDemo(false)}
            variant="outline"
            className="bg-white/90 backdrop-blur-sm border-2 border-black hover:bg-gray-100 font-semibold"
          >
            ← Back to Example
          </Button>
        </div>
        <ClassReportPage />
      </div>
    );
  }

  if (showTimekeepingDemo) {
    return (
      <div className="relative">
        {/* Back button overlay */}
        <div className="absolute bottom-4 left-4 z-50">
          <Button
            onClick={() => setShowTimekeepingDemo(false)}
            variant="outline"
            className="bg-white/90 backdrop-blur-sm border-2 border-black hover:bg-gray-100 font-semibold"
          >
            ← Back to Example
          </Button>
        </div>
        <TimeKeepingPage />
      </div>
    );
  }

  if (showCheckInDemo) {
    return (
      <div className="relative">
        {/* Back button overlay */}
        <div className="absolute bottom-4 left-4 z-50">
          <Button
            onClick={() => setShowCheckInDemo(false)}
            variant="outline"
            className="bg-white/90 backdrop-blur-sm border-2 border-black hover:bg-gray-100 font-semibold"
          >
            ← Back to Example
          </Button>
        </div>
        <CheckInPage />
      </div>
    );
  }

  if (showTimeEntriesDemo) {
    return (
      <div className="relative">
        {/* Back button overlay */}
        <div className="absolute bottom-4 left-4 z-50">
          <Button
            onClick={() => setShowTimeEntriesDemo(false)}
            variant="outline"
            className="bg-white/90 backdrop-blur-sm border-2 border-black hover:bg-gray-100 font-semibold"
          >
            ← Back to Example
          </Button>
        </div>
        <TimeEntriesPage />
      </div>
    );
  }

  if (showColleaguesDemo) {
    return (
      <div className="relative">
        {/* Back button overlay */}
        <div className="absolute bottom-4 left-4 z-50">
          <Button
            onClick={() => setShowColleaguesDemo(false)}
            variant="outline"
            className="bg-white/90 backdrop-blur-sm border-2 border-black hover:bg-gray-100 font-semibold"
          >
            ← Back to Example
          </Button>
        </div>
        <ColleaguesPage />
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
        <AuthPage />
      </div>
    );
  }

  return (
    <div className={cn("h-full pt-8 pl-8 overflow-hidden", className)}>
      {/* Scrollable content container */}
      <div className="h-full overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">🧪 Component & Page Test Center</h1>
                <p className="mt-2 text-lg text-gray-600">
                  Comprehensive testing environment for all pages, components, and UI elements in the ISE English Centre Management System.
                </p>
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm border">
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                  className="flex items-center gap-2"
                >
                  <Grid3X3 className="w-4 h-4" />
                  Cards
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="flex items-center gap-2"
                >
                  <List className="w-4 h-4" />
                  List
                </Button>
              </div>
            </div>

            {/* Current Layout Status */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">📊 Current Layout Status</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Sidebar:</strong> Managed by AppLayout</p>
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

            {viewMode === 'list' ? (
              // List View
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4">📋 Development Progress - List View</h2>
                <p className="text-gray-600 mb-6">
                  Track the development status of all components and pages. Click the eye icon to view demos or the external link for details.
                </p>
                <DevelopmentProgressList />
              </div>
            ) : (
              // Card View (Original)
              <div className="space-y-6">
                {/* Homescreen Redesign Demo Button */}
                <div className="p-6 bg-white rounded-lg shadow-lg border-2 border-green-200">
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
                <div className="p-6 bg-white rounded-lg shadow-lg border-2 border-gray-200">
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
                <div className="p-6 bg-white rounded-lg shadow-lg border-2 border-gray-200">
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
                <div className="p-6 bg-white rounded-lg shadow-lg border-2 border-purple-200">
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
                <div className="p-6 bg-white rounded-lg shadow-lg border-2 border-yellow-200">
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
                <div className="p-6 bg-white rounded-lg shadow-lg border-2 border-blue-200">
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
                <div className="p-6 bg-white rounded-lg shadow-lg border-2 border-red-200">
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

                {/* Student Attendance Demo Button */}
                <div className="p-6 bg-white rounded-lg shadow-lg border-2 border-blue-200">
                  <h2 className="text-xl font-semibold mb-4">📊 Student Attendance Demo - Teacher Dashboard</h2>
                  <p className="text-gray-600 mb-4">
                    View the new student attendance page with feature buttons, class selection, statistics cards,
                    quick actions, and a responsive student grid for attendance tracking.
                  </p>
                  <p className="text-sm text-blue-600 mb-4">
                    <strong>✨ New Features:</strong> FeatureButtonList integration, ClassDateSelector with dropdowns,
                    AttendanceStats with color-coded cards, QuickActions for bulk operations, and responsive StudentAttendanceGrid.
                  </p>
                  <Button
                    onClick={() => setShowAttendancePageDemo(true)}
                    className="bg-[#4A90E2] hover:bg-[#357ABD] text-white px-6 py-3 rounded-[30px] border-2 border-black font-semibold transition-all duration-200"
                  >
                    📊 View Student Attendance Demo
                  </Button>
                </div>

                {/* Class Report Demo Button */}
                <div className="p-6 bg-white rounded-lg shadow-lg border-2 border-purple-200">
                  <h2 className="text-xl font-semibold mb-4">📋 Class Report Demo - Student Reports</h2>
                  <p className="text-gray-600 mb-4">
                    View the new class report page with student information, score inputs, teacher assessments,
                    and export functionality for comprehensive student reporting.
                  </p>
                  <p className="text-sm text-purple-600 mb-4">
                    <strong>✨ New Features:</strong> ReportHeader with export button, ReportFeatureBar with navigation,
                    StudentReportCard with score inputs and assessment textarea, and responsive grid layout.
                  </p>
                  <Button
                    onClick={() => setShowClassReportDemo(true)}
                    className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-6 py-3 rounded-[30px] border-2 border-black font-semibold transition-all duration-200"
                  >
                    📋 View Class Report Demo
                  </Button>
                </div>

                {/* Timekeeping Demo Button */}
                <div className="p-6 bg-white rounded-lg shadow-lg border-2 border-red-200">
                  <h2 className="text-xl font-semibold mb-4">⏰ Timekeeping Demo - Timekeeping Interface</h2>
                  <p className="text-gray-600 mb-4">
                    View the new timekeeping page with timekeeping interface featuring check-in functionality
                    and recent time entries tracking. Matches the Figma design specifications exactly.
                  </p>
                  <p className="text-sm text-red-600 mb-4">
                    <strong>✨ New Features:</strong> CheckInCard with red theme, RecentTimeEntriesCard with purple theme,
                    exact Figma colors, responsive sidebar integration, and downloaded icons from Figma.
                  </p>
                  <Button
                    onClick={() => setShowTimekeepingDemo(true)}
                    className="bg-[#E2445C] hover:bg-[#C73349] text-white px-6 py-3 rounded-[30px] border-2 border-black font-semibold transition-all duration-200"
                  >
                    ⏰ View Timekeeping Demo
                  </Button>
                </div>

                {/* Check In Demo Button */}
                <div className="p-6 bg-white rounded-lg shadow-lg border-2 border-blue-200">
                  <h2 className="text-xl font-semibold mb-4">✅ Check In Demo - Check-in Interface</h2>
                  <p className="text-gray-600 mb-4">
                    View the new check-in page with statistics, upcoming classes, and check-in functionality.
                    Features stat cards, large check-in button, today's check-in section, and upcoming classes panel.
                  </p>
                  <p className="text-sm text-blue-600 mb-4">
                    <strong>✨ New Features:</strong> StatCard components, CheckInButton with gradient styling,
                    TodayCheckIn with classroom image, UpcomingClassesPanel with scrollable class cards,
                    and PageTitle with gradient text styling.
                  </p>
                  <Button
                    onClick={() => setShowCheckInDemo(true)}
                    className="bg-[#4A90E2] hover:bg-[#357ABD] text-white px-6 py-3 rounded-[30px] border-2 border-black font-semibold transition-all duration-200"
                  >
                    ✅ View Check In Demo
                  </Button>
                </div>

                {/* Time Entries Demo Button */}
                <div className="p-6 bg-white rounded-lg shadow-lg border-2 border-green-200">
                  <h2 className="text-xl font-semibold mb-4">📅 Time Entries Demo - Recent Time Entries</h2>
                  <p className="text-gray-600 mb-4">
                    View the new time entries page with two-column layout featuring recent time entries list
                    and notification card for late attendance warnings. Matches Figma design specifications exactly.
                  </p>
                  <p className="text-sm text-green-600 mb-4">
                    <strong>✨ New Features:</strong> Two-column grid layout (2/3 and 1/3 split), TimeEntryCard components
                    with status badges, NotificationCard with alert icon, scrollable time entries list, and exact Figma styling.
                  </p>
                  <Button
                    onClick={() => setShowTimeEntriesDemo(true)}
                    className="bg-[#22E2F8] hover:bg-[#1BC7DC] text-black px-6 py-3 rounded-[30px] border-2 border-black font-semibold transition-all duration-200"
                  >
                    📅 View Time Entries Demo
                  </Button>
                </div>

                {/* Colleagues Demo Button */}
                <div className="p-6 bg-white rounded-lg shadow-lg border-2 border-orange-200">
                  <h2 className="text-xl font-semibold mb-4">👥 Colleagues Demo - Staff Directory</h2>
                  <p className="text-gray-600 mb-4">
                    View the new colleagues page with searchable staff list and profile panel. Matches Figma and wireframe.
                  </p>
                  <Button
                    onClick={() => setShowColleaguesDemo(true)}
                    className="bg-[#FFD600] hover:bg-[#FFC400] text-black px-6 py-3 rounded-[30px] border-2 border-black font-semibold transition-all duration-200"
                  >
                    👥 View Colleagues Demo
                  </Button>
                </div>

                {/* Additional Demo Options */}
                <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
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
              </div>
            )}

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
  );
};

// Main component - no longer needs SidebarProvider since AppLayout handles it
const ExamplePage: React.FC<ExamplePageProps> = ({ className }) => {
  return <ExamplePageContent className={className} />;
};

export default ExamplePage;
