import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, Info, Calendar } from 'lucide-react';

interface ClassDateSelectorProps {
  className?: string;
  onSave?: () => void;
}

interface ClassOption {
  id: string;
  name: string;
  studentCount: number;
}

const ClassDateSelector: React.FC<ClassDateSelectorProps> = ({ className, onSave }) => {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";
  const [selectedClass, setSelectedClass] = useState<string>("CL001");
  const [selectedDate, setSelectedDate] = useState<string>("Today");

  // Mock class data
  const classOptions: ClassOption[] = [
    { id: "CL001", name: "Class 1A", studentCount: 12 },
    { id: "CL002", name: "Class 1B", studentCount: 15 },
    { id: "CL003", name: "Class 2A", studentCount: 10 },
  ];

  // Mock date options
  const dateOptions = [
    "Today",
    "Yesterday", 
    "Tomorrow",
    "Custom Date"
  ];

  const currentClass = classOptions.find(c => c.id === selectedClass);

  const handleSave = () => {
    console.log("Saving attendance data...");
    onSave?.();
  };

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
        <div className="flex items-center justify-between">
          {/* Left side - Class and Date Selection */}
          <div className="flex items-center gap-4">
            {/* Class Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-black font-comfortaa">
                {currentClass?.name}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-1">
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {classOptions.map((classOption) => (
                    <DropdownMenuItem
                      key={classOption.id}
                      onClick={() => setSelectedClass(classOption.id)}
                    >
                      {classOption.name} ({classOption.studentCount} students)
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Date Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-black font-comfortaa">
                {selectedDate}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-1">
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {dateOptions.map((date) => (
                    <DropdownMenuItem
                      key={date}
                      onClick={() => setSelectedDate(date)}
                    >
                      {date}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Right side - Info and Save Button */}
          <div className="flex items-center gap-4">
            {/* Info Display */}
            <div className="flex items-center gap-1">
              <Info className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-600 font-comfortaa">
                {currentClass?.studentCount}
              </span>
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSave}
              className="bg-[#22E2F8] hover:bg-[#1BC7DC] text-black px-4 py-2 rounded-[10px] border-2 border-black font-semibold transition-all duration-200"
            >
              SAVE CHANGES
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassDateSelector; 