import React, { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import TimeEntriesPageTitle from "@/components/timekeeping/TimeEntriesPageTitle";
import TimeEntriesList from "@/components/timekeeping/TimeEntriesList";
import NotificationCard from "@/components/timekeeping/NotificationCard";
import type { TimeEntry, NotificationData } from "@/mockData/timeEntriesMock";
import { useAuth } from "@/contexts/AuthContext";
import checkinService from "@/services/entities/checkinService";

interface TimeEntriesPageProps {
  className?: string;
}

const TimeEntriesPage: React.FC<TimeEntriesPageProps> = ({ className }) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "2-digit" });
  };
  const formatTime = (iso: string) => new Date(iso).toLocaleTimeString(undefined, { hour12: true });

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    checkinService
      .getStatus(user.id)
      .then((rows) => {
        const mapped: TimeEntry[] = (rows || [])
          .sort((a, b) => new Date(b.checkin_time).getTime() - new Date(a.checkin_time).getTime())
          .map((r) => ({
            id: r.id,
            date: formatDate(r.checkin_time),
            clockInTime: formatTime(r.checkin_time),
            status: r.status?.toLowerCase() === "late" ? "late" : "on-time",
          }));
        setEntries(mapped);
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

  const notification: NotificationData = useMemo(() => {
    const lateCount = entries.filter((e) => e.status === "late").length;
    return lateCount >= 3
      ? { message: "You have been late many days recently, please be on time next time.", type: "warning" }
      : { message: "All good. Keep it up!", type: "info" };
  }, [entries]);

  return (
    <div className={cn("h-full overflow-hidden flex flex-col", className)}>
      <div className="flex-1 p-4 pt-8 h-full max-h-screen overflow-hidden">
        <div className="mb-6">
          <TimeEntriesPageTitle />
        </div>

        <div className="grid grid-cols-[2fr_1fr] gap-4 h-[calc(100vh-200px)]">
          <div className="bg-white rounded-[15px] overflow-hidden shadow-lg">
            {loading ? (
              <div className="p-6">Loading...</div>
            ) : (
              <TimeEntriesList entries={entries} />
            )}
          </div>

          <div className="flex justify-center items-start pt-0">
            <NotificationCard notification={notification} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeEntriesPage; 