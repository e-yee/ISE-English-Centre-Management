import React from "react";
import { cn } from "@/lib/utils";
import Class from "@/components/class/Class";
import { useSidebar } from "@/components/ui/sidebar";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import type { ClassData } from "@/types/class";

interface ClassListProps {
  classes?: ClassData[];
  className?: string;
  maxClasses?: number; // Optional limit for displayed classes
  enableRevealOnScroll?: boolean; // Option to disable animations if needed
  customScrollbar?: boolean; // Option to use custom scrollbar styling
  onClassClick?: (classData: ClassData) => void; // Callback for class click
}

const ClassList: React.FC<ClassListProps> = ({
  classes = [],
  className,
  maxClasses,
  enableRevealOnScroll = true,
  customScrollbar = true,
  onClassClick
}) => {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";

  // Apply class limit if specified
  const displayedClasses = maxClasses ? classes.slice(0, maxClasses) : classes;

  return (
    <div className={cn(
      // Main container - transparent background, full height with animations
      'bg-transparent h-full w-full transition-all duration-300 ease-in-out',
      className
    )}>
      {/* Classes Grid with Scroll View and animations */}
      <div className={cn(
        "h-full overflow-y-auto space-y-3 transition-all duration-300 ease-in-out",
        // Padding animation - more space when sidebar is collapsed
        isExpanded ? "p-4" : "p-6",
        // Custom scrollbar styling
        customScrollbar && "custom-scrollbar"
      )}>
        {displayedClasses.map((classData, index) => {
          const classComponent = (
            <div
              className={cn(
                "transition-all duration-300 ease-in-out transform",
                // Staggered animation effect for sidebar state
                isExpanded ? "scale-100" : "scale-[1.01]"
              )}
              style={{
                transitionDelay: `${index * 30}ms`
              }}
            >
              <Class
                classData={classData}
                className={cn(
                  "w-full transition-all duration-300 ease-in-out cursor-pointer",
                  // Enhanced styling when sidebar is collapsed
                  isExpanded
                    ? "shadow-sm hover:shadow-md"
                    : "shadow-md hover:shadow-lg border border-gray-200"
                )}
                onClick={() => onClassClick?.(classData)}
              />
            </div>
          );

          // Conditionally wrap with RevealOnScroll
          if (enableRevealOnScroll) {
            return (
              <RevealOnScroll
                key={classData.id}
                delay={50}
                variant="fade-up"
                className="w-full"
              >
                {classComponent}
              </RevealOnScroll>
            );
          }

          return (
            <div key={classData.id} className="w-full">
              {classComponent}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClassList;
