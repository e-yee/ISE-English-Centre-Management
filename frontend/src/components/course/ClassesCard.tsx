import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Calendar, Clock, MapPin, User } from 'lucide-react';
import { format } from 'date-fns';
import type { Class } from '@/services/entities/classService';

interface ClassesCardProps {
  classes: Class[];
  courseId: string;
  onClick?: () => void;
  summaryOnly?: boolean;
}

const ClassesCard: React.FC<ClassesCardProps> = ({ classes, courseId, onClick, summaryOnly }) => {
  const filteredClasses = classes.filter(cls => cls.course_id === courseId);

  if (summaryOnly) {
    return (
      <Card
        className="border-2 border-green-200 bg-gradient-to-br from-white to-green-50 cursor-pointer hover:shadow-lg transition-all"
        onClick={onClick}
        role="button"
        tabIndex={0}
      >
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b flex flex-row items-center gap-3">
          <GraduationCap className="h-8 w-8 text-green-600" />
          <div>
            <CardTitle className="text-lg font-bold text-gray-800">Classes</CardTitle>
            <CardDescription className="text-green-600">
              {filteredClasses.length > 0 ? `${filteredClasses.length} class${filteredClasses.length !== 1 ? 'es' : ''}` : ''}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className="text-sm text-gray-600">Click to view all classes for this course</p>
        </CardContent>
      </Card>
    );
  }

  if (filteredClasses.length === 0) {
    return (
      <Card className="border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-6 w-6 text-gray-600" />
            <div>
              <CardTitle className="text-lg font-bold text-gray-800">Classes</CardTitle>
              <CardDescription className="text-gray-600">No classes found for this course</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className="text-sm text-gray-500">No classes have been scheduled for this course yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-green-200 bg-gradient-to-br from-white to-green-50">
      <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-6 w-6 text-green-600" />
          <div>
            <CardTitle className="text-lg font-bold text-gray-800">Classes</CardTitle>
            <CardDescription className="text-green-600">
              {filteredClasses.length} class{filteredClasses.length !== 1 ? 'es' : ''} found
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {filteredClasses.map((cls) => (
            <div 
              key={`${cls.id}-${cls.course_id}-${cls.course_date}-${cls.term}`}
              className="border border-green-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-800">Class {cls.id}</h4>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                  Term {cls.term}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">
                    {format(new Date(cls.class_date), "MMM dd, yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">
                    {format(new Date(cls.class_date), "HH:mm")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Room {cls.room_id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Teacher {cls.teacher_id}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassesCard; 