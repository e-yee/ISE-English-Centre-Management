import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { reportFeatureButtons } from '@/mockData/classReportMock';
import type { ReportFeature } from '@/mockData/classReportMock';

const ReportFeatureBar: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<ReportFeature>('information');

  const handleFeatureClick = (feature: ReportFeature) => {
    setActiveFeature(feature);
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-[15px] border border-black/20 shadow-[5px_4px_4px_0px_rgba(0,0,0,0.25)]">
      {reportFeatureButtons.map((button) => (
        <Button
          key={button.id}
          onClick={() => handleFeatureClick(button.id)}
          className={cn(
            "px-6 py-3 rounded-[8px] font-semibold text-[16px] font-comfortaa transition-all duration-200",
            "flex items-center gap-2",
            activeFeature === button.id
              ? "bg-blue-500 text-white shadow-lg transform scale-105"
              : "bg-gray-100 text-black hover:bg-gray-200 hover:scale-105"
          )}
        >
          {button.icon && (
            <img
              src={button.icon}
              alt={`${button.label} icon`}
              className="w-5 h-5"
            />
          )}
          {button.label}
        </Button>
      ))}
    </div>
  );
};

export default ReportFeatureBar; 