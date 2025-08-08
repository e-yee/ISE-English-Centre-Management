import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Student } from '@/types/student';
import { SearchInput } from '@/components/ui/SearchInput';
import { Card, CardContent } from '@/components/ui/card';
import Avatar from '@/components/ui/Avatar';

interface StudentListProps {
  students: Student[];
  selectedStudentId: string | null;
  onSelect: (id: string) => void;
  headerActions?: React.ReactNode;
}

const StudentList: React.FC<StudentListProps> = ({ students, selectedStudentId, onSelect, headerActions }) => {
  const [search, setSearch] = useState('');

  const filtered = students.filter((s) =>
    s.fullname.toLowerCase().includes(search.toLowerCase()) ||
    s.contact_info.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col max-h-screen">
      <div className="px-6 pt-8 pb-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-purple-600">Students</h1>
          {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
        </div>
      </div>

      <div className="flex-1 px-6 pb-6 min-h-0">
        <Card className="h-full max-h-[calc(100vh-200px)]">
          <CardContent className="p-0 h-full flex flex-col">
            <div className="p-6 border-b border-gray-200 flex-shrink-0">
              <div className="w-full">
                <SearchInput
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search students..."
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0">
              {filtered.length > 0 ? (
                <div className="p-4 space-y-3">
                  {filtered.map((student) => (
                    <Card
                      key={student.id}
                      className={cn(
                        'cursor-pointer transition-all duration-200 hover:shadow-md border-2',
                        selectedStudentId === student.id
                          ? 'border-purple-500 bg-purple-50 shadow-md'
                          : 'border-transparent hover:border-gray-200 bg-gray-50'
                      )}
                      onClick={() => onSelect(student.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <Avatar name={student.fullname} src="" size="md" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-gray-900 truncate">{student.fullname}</h3>
                              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                ID: {student.id}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 truncate">{student.contact_info}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <p className="text-lg font-medium">No students found</p>
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

export default StudentList;
