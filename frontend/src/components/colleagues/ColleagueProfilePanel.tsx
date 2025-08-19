import React from 'react';
import { cn } from "@/lib/utils";
import type { Colleague } from '../../mockData/colleaguesMock';
import { Card, CardContent } from '../ui/card';
import Avatar from '../ui/Avatar';

interface ColleagueProfilePanelProps {
  colleague: Colleague;
  onMinimize?: () => void;
}

const AttributeCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <Card>
      <CardContent className="p-4">
        <label className="block text-sm font-bold text-purple-600 mb-2">{title}</label>
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
    <div className="selection:bg-purple-400 selection:text-white h-full overflow-y-auto relative">
      {/* Minimize Button */}
      {onMinimize && (
        <button
          onClick={onMinimize}
          className="cursor-pointer absolute top-4 right-4 z-20 p-2 hover:bg-fuchsia-200 rounded-full transition-colors"
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
      <div className="relative mb-5">
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-blue-100 to-rose-100 rounded-t-lg overflow-hidden">          
        </div>
        <div className="relative pt-14 px-6 pl-2">
          <div className="flex items-end ml-6">
            <Avatar 
              name={colleague.name}
              src={colleague.avatar}
              size="xl"
              className="mr-3 z-10 border-4 border-white shadow-lg"
            />
            <div className="z-10 pb-6">
              <h1 className="text-3xl font-bold text-indigo-600 font-comfortaa">
                {colleague.name}
              </h1>
              <div className="ml-1 flex flex-row gap-2 text-lg">
                <p className="select-all">{colleague.email}</p>
                <p className="select-none">|</p>
                <p className="select-all">{colleague.phone}</p>
              </div>
              
              <div className="ml-1 flex flex-row gap-2 text-sm text-blue-500">
                <p className="underline font-bold select-none">Employee ID:</p>
                <p className="select-all">{colleague.id}</p>
              </div>              
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
            <div className="flex flex-col justify-center items-start">
              <div className="flex flex-row gap-2">
                <p className="font-semibold text-black ">Email:</p>
                <p className="font-normal select-all">{colleague.email}</p>
              </div>    
              <div className="flex flex-row gap-2">
                <p className="font-semibold text-black ">Phone: </p>
                <p className="font-normal select-all">{colleague.phone}</p>
              </div>                         
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