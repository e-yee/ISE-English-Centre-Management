import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { SearchInput } from '@/components/ui/SearchInput';
import StudentRow from './StudentRow';
import { getClassData, type Student } from '@/mockData/scoringMock';
import { Users } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AvatarIcon from '@/assets/class/user.svg';
// FeatureButtonList removed in demo mode to avoid Router dependency

interface ScoreListProps {
  classId: string;
  className?: string;
}

const ScoreList: React.FC<ScoreListProps> = ({ classId, className }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [classType, setClassType] = useState<'english' | 'math'>('english');

  // Get class data
  const classData = getClassData(classId);

  // Initialize students when classData changes
  React.useEffect(() => {
    if (classData) {
      setStudents(classData.students);
    }
  }, [classData]);

  // Filter students based on search term
  const filteredStudents = useMemo(() => {
    if (!searchTerm) return students;
    
    return students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  const columns = useMemo(() => {
    // Keep underlying keys Q1..Q5, change only labels per classType
    if (classType === 'english') {
      return [
        { key: 'Q1' as const, label: 'Quiz 1' },
        { key: 'Q2' as const, label: 'Quiz 2' },
        { key: 'Q3' as const, label: 'Writing 1' },
        { key: 'Q4' as const, label: 'Reading 1' },
        { key: 'Q5' as const, label: 'Quiz 3' },
      ];
    }
    return [
      { key: 'Q1' as const, label: 'Quiz 1' },
      { key: 'Q2' as const, label: 'Quiz 2' },
      { key: 'Q3' as const, label: 'Midterm' },
      { key: 'Q4' as const, label: 'Final' },
      { key: 'Q5' as const, label: 'Homework' },
    ];
  }, [classType]);

  const handleScoreUpdate = (studentId: string, quarter: string, newScore: number) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === studentId
          ? { ...student, scores: { ...student.scores, [quarter]: newScore } }
          : student
      )
    );
  };

  const handleNotesUpdate = (studentId: string, newNotes: string) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === studentId ? { ...student, notes: newNotes } : student
      )
    );
  };

  if (!classData) {
    return (
      <div className={cn("text-center py-12", className)}>
        <h3 className="text-lg font-medium text-gray-900 mb-2 font-comfortaa">Class not found</h3>
        <p className="text-gray-500 font-comfortaa">The requested class could not be found.</p>
      </div>
    );
  }

  return (
    <div className={cn("h-full overflow-hidden flex flex-col", className)}>
      {/* Filter Controls Container - Matching Homescreen.tsx layout */}
      <div className={cn(
        "pt-4 pb-3 flex-shrink-0 transition-all duration-300 ease-in-out",
        "px-4"
      )}>
        <div className="flex items-center justify-between">
          {/* Left side placeholder (FeatureButtonList disabled in demo) */}
          <div className="flex items-center gap-3" />

          {/* Search Input - Right side */}
          <div className="ml-auto flex items-center gap-3">
            <Select value={classType} onValueChange={(v) => setClassType(v as 'english' | 'math')}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Class type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="math">Math</SelectItem>
              </SelectContent>
            </Select>
            <SearchInput
              placeholder="Search students..."
              onSearch={setSearchTerm}
              className="w-80"
            />
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex-1 overflow-hidden flex flex-col pr-6">
        {/* Header Section */}
        <div className="flex-shrink-0 space-y-6">
          {/* Header - Matching ClassInfo.tsx layout */}
          <div className={cn("flex items-center w-full")}>
            {/* Left Side - Class Name */}
            <div className="flex items-center flex-1">
              <div
                className={cn(
                  'bg-transparent rounded-[30px]',
                  'px-0 py-3 flex items-center justify-center'
                )}
              >
                <h1
                  className="text-[60px] font-normal leading-[1.4em] text-center font-comfortaa"
                  style={{
                    background: 'linear-gradient(135deg, #AB2BAF 0%, #471249 100%), linear-gradient(90deg, #E634E1 0%, #E634E1 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  {classData.name}
                </h1>
              </div>
            </div>

            {/* Right Side - Student Count - Positioned to align with rightmost edge */}
            <div className="flex items-center justify-end" style={{ marginRight: '10px' }}>
              <div className="relative">
                <div
                  className="bg-white rounded-[10px] flex items-center justify-center gap-3 px-4 py-0 border-[2px] border-solid"
                  style={{
                    borderColor: '#4A42AE'
                  }}
                >
                  <div className="w-6 h-6 flex-shrink-0">
                    <img
                      src={AvatarIcon}
                      alt="User"
                      className="w-full h-full object-contain"
                      style={{
                        filter: 'opacity(0.6)'
                      }}
                    />
                  </div>
                  <span
                    className="text-[40px] font-normal leading-[1.4em] text-center font-comfortaa"
                    style={{
                      color: 'rgba(0, 0, 0, 0.6)'
                    }}
                  >
                    {filteredStudents.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Students List */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="space-y-4 pb-4">
            {filteredStudents.map((student) => (
              <StudentRow
                key={student.id}
                student={student}
                onScoreUpdate={handleScoreUpdate}
                onNotesUpdate={handleNotesUpdate}
                columns={columns}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredStudents.length === 0 && (
            <Card className="bg-white border border-gray-200 shadow-sm rounded-[15px]">
              <CardContent className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2 font-comfortaa">
                  {searchTerm ? 'No students found' : 'No students in this class'}
                </h3>
                <p className="text-gray-500 font-comfortaa">
                  {searchTerm ? 'Try adjusting your search criteria' : 'Add students to get started'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScoreList; 