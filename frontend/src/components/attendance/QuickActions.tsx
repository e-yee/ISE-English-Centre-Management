import React from 'react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface QuickActionsProps {
  className?: string;
  onMarkAllPresent?: () => void;
  onMarkAllAbsent?: () => void;
  onClearAll?: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ 
  className, 
  onMarkAllPresent, 
  onMarkAllAbsent, 
  onClearAll 
}) => {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";

  const actions = [
    {
      label: "Mark All Present",
      onClick: onMarkAllPresent,
      variant: "default" as const,
      className: "bg-green-500 hover:bg-green-600 text-white"
    },
    {
      label: "Mark All Absent", 
      onClick: onMarkAllAbsent,
      variant: "default" as const,
      className: "bg-red-500 hover:bg-red-600 text-white"
    },
    {
      label: "Clear All",
      onClick: onClearAll,
      variant: "outline" as const,
      className: "border-gray-300 hover:bg-gray-100"
    }
  ];

  return (
    <Card className={cn(
      "bg-white border-2 border-black rounded-[15px] shadow-[5px_4px_4px_0px_rgba(0,0,0,0.25)]",
      "transition-all duration-300 ease-in-out",
      className
    )}>
      <CardContent className={cn(
        "p-4 transition-all duration-300 ease-in-out",
        isExpanded ? "p-4" : "p-3"
      )}>
        <div className="flex items-center gap-4">
          <span className="text-lg font-semibold text-black font-comfortaa">
            Quick Actions:
          </span>
          <div className="flex gap-3">
            {actions.map((action) => (
              <Button
                key={action.label}
                variant={action.variant}
                onClick={action.onClick}
                className={cn(
                  "px-4 py-2 rounded-[10px] border-2 border-black font-semibold transition-all duration-200",
                  action.className
                )}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions; 