import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { StudentData } from '@/mockData/studentListMock';

interface StudentAttendanceCardProps {
  student: StudentData;
  status: 'present' | 'absent' | 'unmarked';
  className?: string;
  onClick?: () => void;
}

const StudentAttendanceCard: React.FC<StudentAttendanceCardProps> = ({ 
  student, 
  status,
  className, 
  onClick 
}) => {
  const getAttendanceColor = (status: 'present' | 'absent' | 'unmarked') => {
    switch (status) {
      case "present":
        return "bg-green-100 border-green-300 hover:border-green-500 hover:bg-green-200"
      case "absent":
        return "bg-red-100 border-red-300 hover:border-red-500 hover:bg-red-200"
      default:
        return "bg-white border-gray-200 hover:border-gray-400 hover:bg-gray-100"
    }
  }

  const getStatusBadge = (status: 'present' | 'absent' | 'unmarked') => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-500 hover:bg-green-600">Present</Badge>
      case "absent":
        return <Badge className="bg-red-500 hover:bg-red-600">Absent</Badge>
      default:
        return <Badge variant="outline">Click to mark</Badge>
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
  }

  return (
    <Card
      className={cn(
        "select-none cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-96",
        getAttendanceColor(status),
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          {/* Simple Avatar Implementation */}
          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
            {getInitials(student.name)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">{student.name}</h3>
            <p className="text-sm text-gray-500">ID: {student.studentId}</p>
          </div>
        </div>

        <div className="flex justify-center">
          {getStatusBadge(status)}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentAttendanceCard; 