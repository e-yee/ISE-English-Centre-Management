import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useEmployees } from "@/hooks/entities/useEmployees";
import ColleagueList from "@/components/colleagues/ColleagueList";
import StaffProfilePanel from "@/components/staff/StaffProfilePanel";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import StaffForm, { type CreateStaffData } from "@/components/staff/StaffForm";
import employeeService from "@/services/entities/employeeService";
import type { Colleague } from "@/mockData/colleaguesMock";

interface StaffPageProps {
  className?: string;
}

const StaffPage: React.FC<StaffPageProps> = ({ className }) => {
  const { user } = useAuth();
  if (user?.role !== "Manager") return <Navigate to="/unauthorized" replace />;
  const navigate = useNavigate();

  const [selectedColleagueId, setSelectedColleagueId] = useState<string | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const { data: employees, isLoading, error, refetch } = useEmployees();

  const colleagues: Colleague[] = (employees || []).map((employee) => ({
    id: employee.id || employee.email,
    name: employee.name || employee.full_name,
    email: employee.email,
    phone: employee.phone || employee.phone_number || "",
    avatar: "",
    nickname: employee.role || employee.nickname || "",
    achievements: Array.isArray(employee.achievements)
      ? employee.achievements.join(", ")
      : employee.achievements || "",
    philosophy: employee.philosophy || "",
    courses:
      employee.courses?.map((course, index) => ({
        id: `C${index + 1}`,
        name: course,
        time: "TBD",
      })) || [],
  }));

  const selectedColleague = colleagues.find((c) => c.id === selectedColleagueId);
  const selectedEmployee = (employees || []).find((e) => (e.id || e.email) === selectedColleagueId);

  if (isLoading) {
    return (
      <div className={cn("h-full flex items-center justify-center", className)}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading staff...</span>
      </div>
    );
  }

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
      <div
        className={cn(
          "h-full flex transition-all duration-500 ease-in-out",
          selectedColleagueId ? "detail-view-active" : ""
        )}
      >
        {/* Staff List */}
        <div
          className={cn(
            "bg-white transition-all duration-500 ease-in-out flex-grow",
            selectedColleagueId ? "w-[40%] border-r border-gray-200" : "w-full"
          )}
        >
          <div className="px-6 pt-4 pb-2 flex-shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-white border border-black/20 rounded-[10px] shadow-[2px_2px_3px_0px_rgba(0,0,0,0.15)] px-4 py-2 transition-all duration-200 ease-in-out hover:shadow-[3px_3px_4px_0px_rgba(0,0,0,0.2)] hover:scale-105 focus:outline-none focus:ring-1 focus:ring-black focus:ring-offset-1 min-w-[90px]"
              >
                <div className="flex items-center">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="text-[16px] font-semibold text-black leading-[1em] font-comfortaa whitespace-nowrap">Back</span>
                </div>
              </button>
              <h1 className="text-2xl font-bold text-purple-600">Staff</h1>
            </div>
            <Button size="sm" onClick={() => setOpenCreate(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Staff
            </Button>
          </div>
          <ColleagueList
            colleagues={colleagues}
            selectedColleagueId={selectedColleagueId}
            onSelect={setSelectedColleagueId}
            headerTitle={null}
            compact
          />
        </div>

        {/* Profile Panel */}
        <div
          className={cn(
            "w-[100%] transition-all duration-500 ease-in-out absolute right-0 top-0 bottom-0 bg-white",
            selectedColleagueId ? "translate-x-0" : "translate-x-full pointer-events-none"
          )}
        >
          {selectedColleague && (
            <StaffProfilePanel
              colleague={selectedColleague}
              onMinimize={() => setSelectedColleagueId(null)}
              onUpdated={() => refetch()}
              role={selectedEmployee?.role}
            />
          )}
        </div>
      </div>

      <StaffForm
        open={openCreate}
        onOpenChange={setOpenCreate}
        isSubmitting={isCreating}
        error={createError}
        onSubmit={async (payload: CreateStaffData) => {
          try {
            setIsCreating(true);
            setCreateError(null);
            await employeeService.managerCreateEmployee(payload);
            await refetch();
            return true;
          } catch (e: any) {
            setCreateError(e?.message || 'Failed to create staff');
            return false;
          } finally {
            setIsCreating(false);
          }
        }}
      />
    </div>
  );
};

export default StaffPage;


