import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn, getUserRole } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';
import { useQueryClient } from '@tanstack/react-query';
import studentService from '@/services/entities/studentService';
import classService from '@/services/entities/classService';

interface FeatureButtonListProps {
  className?: string;
  classId?: string; // Optional classId for class-specific routes
  courseId?: string;
  courseDate?: string;
  term?: number | string;
}

interface FeatureButton {
  id: string;
  title: string;
  route?: string;
  onClick?: () => void;
}

const FeatureButtonList: React.FC<FeatureButtonListProps> = ({ className, classId, courseId, courseDate, term }) => {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const navigate = useNavigate();
  const role = getUserRole() || 'Teacher';
  const queryClient = useQueryClient();

  const prefetchInfo = async () => {
    try {
      if (classId && courseId && courseDate && term) {
        await Promise.all([
          queryClient.prefetchQuery({
            queryKey: ['students', 'class', classId, courseId, courseDate, String(term), role],
            queryFn: () => studentService.getClassStudents(classId, courseId, courseDate, String(term)),
            staleTime: 5 * 60 * 1000
          }),
          queryClient.prefetchQuery({
            queryKey: ['classes', 'course', courseId, courseDate, role],
            queryFn: () => classService.getAllClassesByCourse(courseId, courseDate),
            staleTime: 5 * 60 * 1000
          })
        ]);
      }
    } catch {}
  };

  // Feature buttons with routing
  const featureButtons: FeatureButton[] = (() => {
    const common: FeatureButton[] = [
      {
        id: "back",
        title: "Back",
        onClick: () => navigate(-1)
      }
    ];

    if (role === 'Learning Advisor' || role === 'Manager') {
      // Manager/LA: show Information with full params in URL
      return [
        ...common,
        {
          id: "information",
          title: "Information",
          route:
            classId && courseId && courseDate && term
              ? `/class-info/${classId}/${courseId}/${courseDate}/${term}`
              : undefined,
          onClick: () =>
            navigate(
              classId && courseId && courseDate && term
                ? `/class-info/${classId}/${courseId}/${courseDate}/${term}`
                : '/class-info/1/COURSE/2024-01-01/1'
            )
        }
      ];
    }

    // Teacher: full feature list, Information uses classId only
    return [
      ...common,
      {
        id: "information",
        title: "Information",
        route:
          classId && courseId && courseDate && term
            ? `/class-info/${classId}/${courseId}/${courseDate}/${term}`
            : (classId ? `/class-info/${classId}` : "/class-info/1"),
        onClick: () =>
          navigate(
            classId && courseId && courseDate && term
              ? `/class-info/${classId}/${courseId}/${courseDate}/${term}`
              : (classId ? `/class-info/${classId}` : "/class-info/1")
          )
      },
      {
        id: "scoring",
        title: "Scoring",
        route:
          classId && courseId && courseDate && term
            ? `/scoring/${classId}/${courseId}/${courseDate}/${term}`
            : undefined,
        onClick: () =>
          navigate(
            classId && courseId && courseDate && term
              ? `/scoring/${classId}/${courseId}/${courseDate}/${term}`
              : '/scoring/1/COURSE/2024-01-01/1'
          )
      },
      {
        id: "daily-attendance",
        title: "Daily Attendance",
        route: classId && courseId && courseDate && term ? `/attendance/${classId}/${courseId}/${courseDate}/${term}` : undefined,
        onClick: () => navigate(
          classId && courseId && courseDate && term
            ? `/attendance/${classId}/${courseId}/${courseDate}/${term}`
            : '/attendance/1/COURSE/2024-01-01/1'
        )
      },
      {
        id: "report",
        title: "Report",
        route:
          classId && courseId && courseDate && term
            ? `/report/${classId}/${courseId}/${courseDate}/${term}`
            : undefined,
        onClick: () =>
          navigate(
            classId && courseId && courseDate && term
              ? `/report/${classId}/${courseId}/${courseDate}/${term}`
              : '/report/1/COURSE/2024-01-01/1'
          )
      }
    ];
  })();

  const handleButtonClick = (buttonId: string) => {
    setActiveButton(buttonId);
    if (buttonId === 'information') {
      prefetchInfo();
    }
    const button = featureButtons.find(btn => btn.id === buttonId);
    if (button?.onClick) {
      button.onClick();
    }
  };

  return (
    <div className={cn(
      "select-none w-full transition-all duration-300 ease-in-out",
      className
    )}>
      {/* Horizontal row of feature buttons */}
      <div className="flex items-center gap-3 justify-start">
        {featureButtons.map((button) => (
          <button
            key={button.id}
            onClick={() => handleButtonClick(button.id)}
            onMouseEnter={button.id === 'information' ? prefetchInfo : undefined}
            className={cn(
              // Base styling reduced to match status button size
              "bg-white border border-black/20 rounded-[10px]",
              "nth-1:bg-red-400 nth-1:text-white/90 nth-1:hover:bg-red-500 nth-1:hover:text-white",
              "px-4 h-8 transition-all duration-200 ease-in-out",
              "hover:bg-[#223A5E] hover:scale-110",
              "focus:outline-none focus:ring-1 focus:ring-black focus:ring-offset-1",
              "text-[14px] font-semibold text-black leading-[1em] font-comfortaa",
              "whitespace-nowrap hover:text-white",
              "cursor-pointer",
              // Active state styling
              activeButton === button.id && "bg-gray-100 scale-105",
              // Responsive sizing based on sidebar state - reduced sizes
              isExpanded ? "min-w-[80px]" : "min-w-[90px]"
            )}
          >
            {button.title}            
          </button>
        ))}
      </div>
    </div>
  );
};

export default FeatureButtonList;
