import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, className }) => {
  return (
    <Card className={cn(
      "bg-white/80 backdrop-blur-sm border border-black/20 rounded-[15px] p-4 flex flex-col items-center justify-center gap-1",
      "transition-all duration-200 hover:shadow-lg",
      className
    )}>
      {/* Icon */}
      <div className="text-black mb-1">
        {icon}
      </div>
      
      {/* Value */}
      <div className="text-xl font-bold text-black text-center">
        {value}
      </div>
      
      {/* Label */}
      <div className="text-lg font-bold text-black/50 text-center">
        {label}
      </div>
    </Card>
  );
};

export default StatCard; 