import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import type { Colleague } from '../../mockData/colleaguesMock';
import { SearchInput } from '../ui/SearchInput';
import { Card, CardContent } from '../ui/card';
import Avatar from '../ui/Avatar';

interface ColleagueListProps {
  colleagues: Colleague[];
  selectedColleagueId: string | null;
  onSelect: (id: string) => void;
  headerTitle?: string | null; // null hides header
  compact?: boolean; // reduces paddings/heights
}

const ColleagueList: React.FC<ColleagueListProps> = ({
  colleagues,
  selectedColleagueId,
  onSelect,
  headerTitle = 'Colleagues',
  compact = false,
}) => {
  const [search, setSearch] = useState('');
  
  const filtered = colleagues.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.nickname.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col max-h-screen">
      {/* Optional Title */}
      {headerTitle !== null && (
        <div className={cn("flex-shrink-0", compact ? "px-6 pt-4 pb-2" : "px-6 pt-8 pb-4")}> 
          <h1 className="text-2xl font-bold text-purple-600">{headerTitle}</h1>
        </div>
      )}

      {/* Main card container that fits with header */}
      <div className="flex-1 px-6 pb-6 min-h-0">
        <Card className={cn("h-full", compact ? "max-h-[calc(100vh-160px)]" : "max-h-[calc(100vh-200px)]") }>
          <CardContent className="p-0 h-full flex flex-col">
            {/* Search Bar - full width */}
            <div className={cn("border-b border-gray-200 flex-shrink-0", compact ? "p-4" : "p-6") }>
              <div className="w-full">
                <SearchInput 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                  placeholder={headerTitle ? `Search ${headerTitle.toLowerCase()}...` : 'Search...'} 
                  className="w-full"
                />
              </div>
            </div>

            {/* Colleague List */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {filtered.length > 0 ? (
                <div className={cn("space-y-3", compact ? "p-3" : "p-4") }>
                  {filtered.map(colleague => (
                    <Card
                      key={colleague.id}
                      className={cn(
                        "cursor-pointer transition-all duration-200 hover:shadow-md border-2",
                        selectedColleagueId === colleague.id
                          ? "border-purple-500 bg-purple-50 shadow-md"
                          : "border-transparent hover:border-gray-200 bg-gray-50"
                      )}
                      onClick={() => onSelect(colleague.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <Avatar 
                            name={colleague.name}
                            src={colleague.avatar}
                            size="md"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {colleague.name}
                              </h3>
                              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                ID: {colleague.id}
                              </span>
                              {colleague.nickname && (
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                  {colleague.nickname}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 truncate">
                              {colleague.email}
                            </p>
                            {colleague.courses.length > 0 && (
                              <p className="text-xs text-gray-400 mt-1">
                                {colleague.courses.length} course{colleague.courses.length !== 1 ? 's' : ''}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <p className="text-lg font-medium">No colleagues found</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ColleagueList;