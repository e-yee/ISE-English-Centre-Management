import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';

// Import SVG icons
import ScoringIcon from '@/assets/feature_bar/scoring.svg';
import AttendanceCheckIcon from '@/assets/feature_bar/attendance_check.svg';
import DailyEvaluationIcon from '@/assets/feature_bar/daily_evolution.svg';
import ExportReportIcon from '@/assets/feature_bar/export.svg';
import FormIcon from '@/assets/feature_bar/copy.svg';

interface FeatureBarProps {
  className?: string;
}

interface FeatureItem {
  id: string;
  title: string;
  icon: string;
}

const FeatureBar: React.FC<FeatureBarProps> = ({ className }) => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const { state } = useSidebar();
  const isExpanded = state === "expanded";

  // Feature items - limited to 5 features
  const featureItems: FeatureItem[] = [
    {
      id: "scoring",
      title: "Scoring",
      icon: ScoringIcon,
    },
    {
      id: "attendance-check",
      title: "Attendance check",
      icon: AttendanceCheckIcon,
    },
    {
      id: "daily-evaluation",
      title: "Daily Evaluation",
      icon: DailyEvaluationIcon,
    },
    {
      id: "export-report",
      title: "Export Report",
      icon: ExportReportIcon,
    },
    {
      id: "form",
      title: "Form",
      icon: FormIcon,
    },
  ];

  const handleFeatureClick = (featureId: string) => {
    setActiveFeature(featureId);
    console.log(`Feature clicked: ${featureId}`);
    // Add feature click functionality here
  };


  // NEW LAYOUT - Expands like ClassList with responsive icon positioning
  return (
    <div
      className={cn(
        // Main container with black border, no shadow
        'bg-white rounded-[30px] border-2 border-black',
        'w-full transition-all duration-300 ease-in-out h-full select-none cursor-pointer',
        className
      )}
    >
      {/* Content area with responsive padding matching ClassList */}
      <div className={cn(
        "h-full transition-all duration-300 ease-in-out",
        // Match ClassList padding logic exactly
        isExpanded ? "p-6" : "p-4"
      )}>
        {/* Feature Icons Container - Distributed across full width with responsive sizing */}
        <div className="h-full flex items-center justify-between">
          {featureItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleFeatureClick(item.id)}
              className={cn(
                // Icon container - enlarge when sidebar is compressed
                'flex items-center justify-center',
                'cursor-pointer transition-all duration-300 ease-out',
                'hover:scale-110',
                // Icon sizing - larger when sidebar compressed, smaller when expanded
                isExpanded ? 'w-[100px] h-[100px]' : 'w-[130px] h-[130px]',
                // Active state
                activeFeature === item.id,
              )}
              title={item.title}
            >
              <img
                src={item.icon}
                alt={item.title}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureBar;
