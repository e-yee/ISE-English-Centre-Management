# Layout Refactoring Plan

## Overview
This plan outlines the refactoring of pages that currently include Header and Sidebar components directly, to use the new AppLayout component instead. This will eliminate code duplication and improve maintainability.

## AppLayout Component Created
**Location:** `frontend/src/components/layout/AppLayout.tsx`

**Features:**
- Provides Header and Sidebar components
- Handles responsive sidebar state (expanded/collapsed)
- Uses React Router's `<Outlet />` for page content
- Maintains consistent layout structure across all pages

## Pages to Refactor

### 1. AbsentRequestPage.tsx
**Current Structure:**
- Header + Sidebar + AbsenceRequestForm
- Custom layout with title and icon section

**Refactoring Steps:**
1. Remove Header and Sidebar imports
2. Remove SidebarProvider wrapper
3. Remove layout container divs
4. Keep only the content area (title + form)
5. Update className to work within AppLayout

**After Refactor:**
```typescript
const AbsentRequestPage = () => {
  return (
    <div className="h-full overflow-y-auto flex flex-col items-center pt-8">
      <div className="w-full max-w-4xl">
        {/* Title and Icon Section */}
        <div className="flex items-center space-x-4 mb-8">
          {/* ... existing title content ... */}
        </div>
        <AbsenceRequestForm />
      </div>
    </div>
  );
};
```

### 2. CheckInPage.tsx
**Current Structure:**
- Header + Sidebar + Grid layout with stats and check-in components

**Refactoring Steps:**
1. Remove Header and Sidebar imports
2. Remove SidebarProvider wrapper
3. Remove layout container divs
4. Keep only the grid content
5. Update margin classes (remove ml-[335px] and ml-[120px])

**After Refactor:**
```typescript
const CheckInPage = () => {
  return (
    <div className="h-full p-4 pt-8 grid grid-cols-1 lg:grid-cols-[48%_52%] gap-4">
      {/* Left Column */}
      <div className="flex flex-col gap-3">
        <PageTitle />
        {/* Stats and Check-in components */}
      </div>
      {/* Right Column */}
      <div className="flex flex-col gap-0">
        <UpcomingClassesPanel />
      </div>
    </div>
  );
};
```

### 3. TimeKeeping.tsx
**Current Structure:**
- Header + Sidebar + Title + Cards layout

**Refactoring Steps:**
1. Remove Header and Sidebar imports
2. Remove SidebarProvider wrapper
3. Remove layout container divs
4. Keep only the title and cards content
5. Update margin classes

**After Refactor:**
```typescript
const TimeKeepingPage = () => {
  return (
    <div className="h-full p-8 overflow-y-auto">
      {/* Large Title */}
      <div className="text-center mb-8">
        <h1 className="text-[50px] font-bold bg-gradient-to-r from-[#6641D4] to-[#35226E] bg-clip-text text-transparent font-comfortaa">
          Check In
        </h1>
      </div>
      {/* Cards Container */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 gap-6">
        <CheckInCard />
        <RecentTimeEntriesCard />
      </div>
    </div>
  );
};
```

### 4. TimeEntriesPage.tsx
**Current Structure:**
- Header + Sidebar + Two-column layout with time entries and notifications

**Refactoring Steps:**
1. Remove Header and Sidebar imports
2. Remove SidebarProvider wrapper
3. Remove layout container divs
4. Keep only the two-column content
5. Update margin classes

**After Refactor:**
```typescript
const TimeEntriesPage = () => {
  return (
    <div className="h-full p-4 pt-8">
      {/* Page Title */}
      <div className="mb-6">
        <TimeEntriesPageTitle />
      </div>
      {/* Two-column layout */}
      <div className="grid grid-cols-[2fr_1fr] gap-4 h-[calc(100vh-200px)]">
        <TimeEntriesList entries={timeEntriesMock} />
        <NotificationCard notification={notificationMock} />
      </div>
    </div>
  );
};
```

### 5. ColleaguesPage.tsx
**Current Structure:**
- Header + Sidebar + Two-pane layout with colleague list and profile panel

**Refactoring Steps:**
1. Remove Header and Sidebar imports
2. Remove SidebarProvider wrapper
3. Remove layout container divs
4. Keep only the two-pane content
5. Update margin classes

**After Refactor:**
```typescript
const ColleaguesPage = () => {
  const [selectedColleagueId, setSelectedColleagueId] = useState<string | null>(null);
  const { data: employees, isLoading, error, refetch } = useEmployees();
  
  // Transform data logic...
  
  if (isLoading) return <LoadingComponent />;
  if (error) return <ErrorComponent error={error} onRetry={refetch} />;
  
  return (
    <div className="h-full flex">
      {/* Colleague List */}
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
      
      {/* Profile Panel */}
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
  );
};
```

### 6. ProfileSettingPage.tsx
**Current Structure:**
- Header + Sidebar + Centered profile card

**Refactoring Steps:**
1. Remove Header and Sidebar imports
2. Remove SidebarProvider wrapper
3. Remove layout container divs
4. Keep only the profile card content
5. Update margin classes

**After Refactor:**
```typescript
const ProfileSettingPage = () => {
  return (
    <div className="h-full flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-6xl mx-auto">
        <ProfileCard className="w-full" />
      </div>
    </div>
  );
};
```

## Router Updates Required

### Update router.tsx
Replace the placeholder `<div />` with AppLayout:

```typescript
import AppLayout from '@/components/layout/AppLayout';

export const router = createBrowserRouter([
  // Root level routes (NO AppLayout)
  {
    path: '/auth/*',
    element: <AuthPage />,
  },
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },
  
  // AppLayout routes (WITH sidebar)
  {
    path: '/',
    element: <AppLayout />, // Replace placeholder div
    children: [
      { path: 'home', element: <Homescreen /> },
      { path: 'colleagues', element: <ColleaguesPage /> },
      { path: 'absent-request', element: <AbsentRequestPage /> },
      { path: 'checkin', element: <CheckInPage /> },
      { path: 'timekeeping', element: <TimeKeepingPage /> },
      { path: 'time-entries', element: <TimeEntriesPage /> },
      { path: 'profile', element: <ProfileSettingPage /> },
    ],
  },
  
  // Catch-all
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
```

## Implementation Steps

### Phase 1: Create AppLayout
- ✅ AppLayout component created
- Test AppLayout in isolation

### Phase 2: Update Router
- Update router.tsx to use AppLayout
- Add routes for all refactored pages
- Test navigation between pages

### Phase 3: Refactor Pages (One by One)
1. **AbsentRequestPage.tsx**
   - Remove layout imports
   - Remove SidebarProvider
   - Keep only content
   - Test functionality

2. **CheckInPage.tsx**
   - Remove layout imports
   - Remove SidebarProvider
   - Keep only grid content
   - Test responsive behavior

3. **TimeKeeping.tsx**
   - Remove layout imports
   - Remove SidebarProvider
   - Keep only title and cards
   - Test layout

4. **TimeEntriesPage.tsx**
   - Remove layout imports
   - Remove SidebarProvider
   - Keep only two-column content
   - Test responsive grid

5. **ColleaguesPage.tsx**
   - Remove layout imports
   - Remove SidebarProvider
   - Keep only two-pane content
   - Test colleague selection

6. **ProfileSettingPage.tsx**
   - Remove layout imports
   - Remove SidebarProvider
   - Keep only profile card
   - Test centering

### Phase 4: Testing and Verification
- Test navigation from sidebar
- Verify sidebar state management
- Check responsive behavior
- Ensure all functionality works
- Test loading and error states

## Benefits of Refactoring

1. **Eliminates Code Duplication**
   - No more repeating Header + Sidebar in every page
   - Consistent layout across all pages

2. **Improves Maintainability**
   - Layout changes only need to be made in one place
   - Easier to add new pages with consistent layout

3. **Better Organization**
   - Clear separation between layout and page content
   - Pages focus only on their specific functionality

4. **Reduced Bundle Size**
   - Less repetitive code
   - Better tree-shaking opportunities

5. **Easier Testing**
   - Layout can be tested independently
   - Page components are simpler to test

## Files to Create/Modify

### New Files
- ✅ `frontend/src/components/layout/AppLayout.tsx`

### Files to Modify
- `frontend/src/routes/router.tsx`
- `frontend/src/pages/absent-request/AbsentRequestPage.tsx`
- `frontend/src/pages/timekeeping/CheckInPage.tsx`
- `frontend/src/pages/timekeeping/TimeKeeping.tsx`
- `frontend/src/pages/timekeeping/TimeEntriesPage.tsx`
- `frontend/src/pages/colleagues/ColleaguesPage.tsx`
- `frontend/src/pages/profile/ProfileSettingPage.tsx`

## Notes
- All pages will maintain their existing functionality
- Sidebar navigation will work properly once router is updated
- Responsive behavior will be preserved
- Loading and error states will continue to work
- The refactoring is purely structural - no functional changes 