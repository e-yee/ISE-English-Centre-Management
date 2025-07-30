import React from 'react';
import { cn } from "@/lib/utils";
import type { Colleague } from '../../mockData/colleaguesMock';
import { Card, CardContent } from '../ui/card';

interface ColleagueProfilePanelProps {
  colleague: Colleague;
  onMinimize?: () => void;
}

const AttributeCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <Card>
      <CardContent className="p-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">{title}</label>
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md max-h-[120px] overflow-y-auto">
          {children}
        </div>
      </CardContent>
    </Card>
);

const ColleagueProfilePanel: React.FC<ColleagueProfilePanelProps> = ({ colleague, onMinimize }) => {
  if (!colleague) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-500">
          <p className="text-lg">No colleague selected</p>
          <p className="text-sm">Select a colleague from the list to view their profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto relative">
      {/* Minimize Button */}
      {onMinimize && (
        <button
          onClick={onMinimize}
          className="absolute top-4 right-4 z-20 p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="Minimize panel"
        >
          <img 
            src="/src/assets/colleague_minimize.svg" 
            alt="Minimize" 
            className="w-6 h-6"
          />
        </button>
      )}
      {/* Profile Header with Background Frame */}
      <div className="relative mb-8 pb-16">
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-blue-100 to-blue-50 rounded-t-lg overflow-hidden">
          <img 
            src="/src/assets/frame.svg" 
            alt="Background frame" 
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        <div className="relative pt-21 px-6">
          <div className="flex items-end">
            <img 
              src={colleague.avatar} 
              alt={colleague.name} 
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg mr-6 z-10"
            />
            <div className="z-10 pb-4">
              <h1 className="text-3xl font-bold text-gray-900 font-comfortaa mb-2">
                {colleague.name}
              </h1>
              <p className="text-lg text-gray-600">
                {colleague.email} | {colleague.phone}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Attributes Grid */}
      <div className="px-8 grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <AttributeCard title="Nickname">
            <p>{colleague.nickname}</p>
          </AttributeCard>
          
          <AttributeCard title="Philosophy">
            <p>{colleague.philosophy}</p>
          </AttributeCard>
          
          <AttributeCard title="Contact">
            <div>
              <p>Email: {colleague.email}</p>
              <p className="mt-1">Phone: {colleague.phone}</p>
            </div>
          </AttributeCard>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          <AttributeCard title="Achievements">
            <p>{colleague.achievements}</p>
          </AttributeCard>
          
          <AttributeCard title="Courses Teaching">
            {colleague.courses.length > 0 ? (
              <div className="space-y-3">
                {colleague.courses.map(course => (
                  <div key={course.id} className="border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                    <h3 className="font-medium text-gray-900 text-sm">{course.name}</h3>
                    <p className="text-xs text-gray-600 mt-1">{course.time}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-3 text-gray-500">
                <p className="text-sm">No courses assigned</p>
              </div>
            )}
          </AttributeCard>
        </div>
      </div>
    </div>
  );
};

export default ColleagueProfilePanel;