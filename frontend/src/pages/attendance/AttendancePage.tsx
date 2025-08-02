import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import FeatureButtonList from '@/components/class/FeatureButtonList';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Bell, User, ChevronDown } from 'lucide-react';
import StudentAttendanceCard from '@/components/attendance/StudentAttendanceCard';
import { getStudentsByClassId } from '@/mockData/studentListMock';

interface AttendancePageProps {
  className?: string;
}

type AttendanceStatus = 'present' | 'absent' | 'unmarked';

const AttendancePage: React.FC<AttendancePageProps> = ({ className }) => {
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [selectedDate, setSelectedDate] = useState("Today");

  // Sample student data - using existing mock data
  const students = getStudentsByClassId("CL001");

  const dateOptions = ["Today", "Yesterday", "Custom Date"];

  const toggleAttendance = (studentId: string) => {
    setAttendance((prev) => {
      const current = prev[studentId] || "unmarked";
      let next: AttendanceStatus;

      if (current === "unmarked") {
        next = "present";
      } else if (current === "present") {
        next = "absent";
      } else {
        next = "present";
      }

      return { ...prev, [studentId]: next };
    });
  };

  const presentCount = Object.values(attendance).filter((status) => status === "present").length;
  const absentCount = Object.values(attendance).filter((status) => status === "absent").length;
  const totalStudents = students.length;

  return (
    <div className={cn("h-full overflow-hidden flex flex-col", className)}>
      {/* Feature Button List - positioned between header and class info */}
      <div className={cn(
        "pt-4 pb-3 flex-shrink-0 transition-all duration-300 ease-in-out",
        "px-4"
      )}>
        <FeatureButtonList />
      </div>

      {/* Main Content */}
      <main className="p-6 flex-1 overflow-hidden flex flex-col">
        {/* Class Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-light text-purple-600">Class 1A</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-32 justify-between">
                  {selectedDate}
                  <ChevronDown className="h-4 w-4" />
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

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{totalStudents}</span>
            </div>
            <Button className="bg-teal-600 hover:bg-teal-700">SAVE CHANGES</Button>
          </div>
        </div>

        {/* Attendance Stats */}
        <div className="flex gap-4 mb-4">
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
            <div className="text-green-800 font-semibold">Present: {presentCount}</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2">
            <div className="text-red-800 font-semibold">Absent: {absentCount}</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
            <div className="text-gray-800 font-semibold">
              Unmarked: {totalStudents - presentCount - absentCount}
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="flex gap-3 mb-6 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">Quick Actions:</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-green-700 border-green-300 hover:bg-green-50 bg-transparent"
            onClick={() => {
              const allPresentAttendance = students.reduce(
                (acc, student) => {
                  acc[student.id] = "present";
                  return acc;
                },
                {} as Record<string, AttendanceStatus>,
              );
              setAttendance(allPresentAttendance);
            }}
          >
            Mark All Present
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-700 border-red-300 hover:bg-red-50 bg-transparent"
            onClick={() => {
              const allAbsentAttendance = students.reduce(
                (acc, student) => {
                  acc[student.id] = "absent";
                  return acc;
                },
                {} as Record<string, AttendanceStatus>,
              );
              setAttendance(allAbsentAttendance);
            }}
          >
            Mark All Absent
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-gray-700 border-gray-300 hover:bg-gray-50 bg-transparent"
            onClick={() => setAttendance({})}
          >
            Clear All
          </Button>
        </div>

        {/* Student Grid Container - Full width and height */}
        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 h-full overflow-y-auto">
            {students.map((student) => {
              const status = attendance[student.id] || "unmarked";
              return (
                <StudentAttendanceCard
                  key={student.id}
                  student={student}
                  status={status}
                  onClick={() => toggleAttendance(student.id)}
                />
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AttendancePage; 