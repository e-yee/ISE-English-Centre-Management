import React from 'react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';
import { Card, CardContent } from '@/components/ui/card';

interface AttendanceStatsProps {
  className?: string;
  presentCount?: number;
  absentCount?: number;
  unmarkedCount?: number;
}

const AttendanceStats: React.FC<AttendanceStatsProps> = ({ 
  className, 
  presentCount = 0, 
  absentCount = 0, 
  unmarkedCount = 12 
}) => {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";

  const stats = [
    {
      label: "Present",
      count: presentCount,
      bgColor: "bg-green-100",
      borderColor: "border-green-300",
      textColor: "text-green-800"
    },
    {
      label: "Absent", 
      count: absentCount,
      bgColor: "bg-red-100",
      borderColor: "border-red-300", 
      textColor: "text-red-800"
    },
    {
      label: "Unmarked",
      count: unmarkedCount,
      bgColor: "bg-gray-100",
      borderColor: "border-gray-300",
      textColor: "text-gray-800"
    }
  ];

  return (
    <div className={cn(
      "flex gap-4 transition-all duration-300 ease-in-out",
      className
    )}>
      {stats.map((stat, index) => (
        <Card key={stat.label} className={cn(
          "flex-1 border-2 rounded-[15px] shadow-[5px_4px_4px_0px_rgba(0,0,0,0.25)]",
          "transition-all duration-300 ease-in-out",
          stat.bgColor,
          stat.borderColor
        )}>
          <CardContent className={cn(
            "p-4 text-center transition-all duration-300 ease-in-out",
            isExpanded ? "p-4" : "p-3"
          )}>
            <div className={cn(
              "text-2xl font-bold font-comfortaa",
              stat.textColor
            )}>
              {stat.count}
            </div>
            <div className={cn(
              "text-sm font-semibold font-comfortaa mt-1",
              stat.textColor
            )}>
              {stat.label}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AttendanceStats; 