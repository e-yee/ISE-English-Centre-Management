import React from "react";
import { cn } from "@/lib/utils";
import type { TimeEntry } from "@/mockData/timeEntriesMock";
import TimeEntryCard from "./TimeEntryCard";

interface TimeEntriesListProps {
  entries: TimeEntry[];
  className?: string;
}

const TimeEntriesList: React.FC<TimeEntriesListProps> = ({ entries, className }) => {
  if (entries.length === 0) {
    return (
      <div className={cn(
        "flex items-center justify-center h-full text-gray-500 font-comfortaa",
        className
      )}>
        <p className="text-lg">No time entries found</p>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex flex-col gap-4 p-6 overflow-y-auto h-full",
      className
    )}>
      {entries.map((entry) => (
        <TimeEntryCard 
          key={entry.id} 
          entry={entry}
        />
      ))}
    </div>
  );
};

export default TimeEntriesList; 