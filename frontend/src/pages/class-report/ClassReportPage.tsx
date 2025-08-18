import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import FeatureButtonList from '@/components/class/FeatureButtonList';
import { classReportMockData } from '@/mockData/classReportMock';
import type { StudentReportData } from '@/mockData/classReportMock';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import AvatarIcon from '@/assets/class/user.svg';
import { ExportNotification } from '@/components/notifications/ExportNotification';

interface ClassReportPageProps {
  className?: string;
}

const ClassReportPage: React.FC<ClassReportPageProps> = ({ className }) => {
  const [students, setStudents] = useState<StudentReportData[]>(classReportMockData.students);
  const [showNotification, setShowNotification] = useState(false);

  const handleScoreChange = (studentId: string, type: keyof StudentReportData['scores'], value: number) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId 
        ? { ...student, scores: { ...student.scores, [type]: value } }
        : student
    ));
  };

  const handleAssessmentChange = (studentId: string, value: string) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId 
        ? { ...student, assessment: value }
        : student
    ));
  };

  const handleExport = () => {
    console.log('Export functionality will be implemented later');
    setShowNotification(true);
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  return (
    <div className={cn("h-full overflow-hidden flex flex-col", className)}>
      {/* Export Notification */}
      <ExportNotification 
        isOpen={showNotification} 
        onClose={handleCloseNotification} 
      />
      
      {/* Feature Button List - Beneath header like in Homescreen.tsx */}
      <div className={cn(
        "pt-4 pb-3 flex-shrink-0 transition-all duration-300 ease-in-out",
        "px-4"
      )}>
        <FeatureButtonList />
      </div>

      {/* Main Content Container */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* One Big Container - Report Header + Student Cards */}
          <Card className="bg-white border border-black/20 shadow-[5px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-[15px]">
            <CardContent className="p-6">
              {/* Report Header Section */}
              <div className="flex items-center justify-between mb-6">
                {/* Left Section - Report Badge and Class Name */}
                <div className="flex items-center gap-4">
                  {/* Report Badge - Changed to black */}
                  <div className="text-gray-500 px-1 rounded-[15px] font-semibold text-[30px] font-comfortaa border-2 border-gray-500">
                    Report
                  </div>

                  {/* Class Name - Reduced size */}
                  <div 
                    className="text-[40px] font-normal leading-[1.4em] font-comfortaa
                               text-violet-600"                    
                  >
                    {classReportMockData.className}
                  </div>
                </div>

                {/* Right Section - Export Button and Student Count */}
                <div className="flex items-center gap-6">
                  {/* Export Button */}
                  <Button
                    className="cursor-pointer bg-[#7C8FD5] hover:shadow-lg hover:scale-95 hover:bg-indigo-600 text-white px-3 py-2 rounded-[10px] font-semibold text-[18px] font-comfortaa transition-colors duration-200"
                    onClick={handleExport}
                  >
                    Export
                  </Button>

                  {/* Student Count - Reduced size */}
                  <div className="relative">
                    <div
                      className="bg-white rounded-[10px] flex items-center justify-center gap-2 px-3 py-0 border-[2px] border-solid"
                      style={{
                        borderColor: '#4A42AE'
                      }}
                    >
                      <img
                        src={AvatarIcon}
                        alt="User"
                        className="w-5 h-5 object-contain"
                        style={{
                          filter: 'opacity(0.6)'
                        }}
                      />
                      <span
                        className="text-[24px] font-normal leading-[1.4em] font-comfortaa"
                        style={{
                          color: 'rgba(0, 0, 0, 0.6)'
                        }}
                      >
                        {classReportMockData.studentCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Student Report Cards - List Layout */}
              <div className="space-y-4">
                {students.map((student) => (
                  <StudentReportCard
                    key={student.id}
                    student={student}
                    onScoreChange={(type, value) => handleScoreChange(student.id, type, value)}
                    onAssessmentChange={(value) => handleAssessmentChange(student.id, value)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// New StudentReportCard component following StudentTab.tsx sizing
interface StudentReportCardProps {
  student: StudentReportData;
  onScoreChange: (type: keyof StudentReportData['scores'], value: number) => void;
  onAssessmentChange: (value: string) => void;
}

const StudentReportCard: React.FC<StudentReportCardProps> = ({
  student,
  onScoreChange,
  onAssessmentChange
}) => {
  const { index, name, studentId, scores, assessment } = student;

  const handleScoreChange = (type: keyof typeof scores, value: string) => {
    const numValue = parseInt(value) || 0;
    onScoreChange(type, numValue);
  };

  return (
    <Card className="bg-white border border-black rounded-[15px] shadow-[5px_4px_4px_0px_rgba(0,0,0,0.25)] transition-all duration-300 ease-in-out">
      <CardContent className="p-4">
        {/* Student Information Section - Top */}
        <div className="mb-4">
          <div className="text-[24px] font-semibold text-black leading-[1.4em] font-comfortaa">
            {index}. {name}
          </div>
          <div className="text-[18px] font-semibold text-black/50 leading-[1.4em] font-comfortaa">
            ID: {studentId}
          </div>
        </div>

        {/* Scores and Assessment Section - Below student info */}
        <div className="flex gap-6">
          {/* Scores Section - Left side */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-row items-center gap-2">
              <span className="text-[16px] font-semibold text-black leading-[1.4em] font-comfortaa">
                Homework:
              </span>
              <div className='flex flex-row justify-end w-full'>
                <Input
                  type="number"
                  value={scores.homework}
                  onChange={(e) => handleScoreChange('homework', e.target.value)}
                  className="h-7 w-16 rounded-[8px] border border-black/20 bg-[rgba(102,102,102,0.5)] text-[14px] font-normal text-black font-comfortaa text-center"
                  placeholder="0"
                  min="0"
                  max="100"
                  readOnly
                />
              </div>
            </div>

            <div className="flex flex-row items-center gap-2">
              <span className="text-[16px] font-semibold text-black leading-[1.4em] font-comfortaa">
                Midterm:
              </span>
              <div className='flex flex-row justify-end w-full'>
                <Input
                  type="number"
                  value={scores.midterm}
                  onChange={(e) => handleScoreChange('midterm', e.target.value)}
                  className="h-7 w-16 rounded-[8px] border border-black/20 bg-[rgba(102,102,102,0.5)] px-2 text-[14px] font-normal text-black font-comfortaa text-center"
                  placeholder="0"
                  min="0"
                  max="100"
                  readOnly
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[16px] font-semibold text-black leading-[1.4em] font-comfortaa">
                Final:
              </span>
              <div className='flex flex-row justify-end w-full'>
                <Input
                  type="number"
                  value={scores.final}
                  onChange={(e) => handleScoreChange('final', e.target.value)}
                  className="h-7 w-16 rounded-[8px] border border-black/20 bg-[rgba(102,102,102,0.5)] px-2 text-[14px] font-normal text-black font-comfortaa text-center"
                  placeholder="0"
                  min="0"
                  max="100"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Teacher Assessment Section - Right side, aligned with Homework */}
          <div className="flex-1">
            {/* MANUAL ADJUSTMENT: To move Teacher Assessment up/down, change this margin-top */}
            <div className="text-[18px] font-semibold text-black leading-[1.4em] font-comfortaa mb-2 mt-[-35px]">
              Teacher Assessment
            </div>
            {/* MANUAL ADJUSTMENT: To move textarea up/down, change margin-top or padding-top */}
            <Textarea
              value={assessment}
              onChange={(e) => onAssessmentChange(e.target.value)}
              placeholder="Write your assessment here..."
              className="w-full h-[100px] rounded-[15px] border border-black bg-[rgba(154,142,142,0.2)] px-3 py-2 text-[14px] font-semibold text-black/50 font-comfortaa resize-none focus:outline-none focus:border-black focus:ring-0"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassReportPage; 