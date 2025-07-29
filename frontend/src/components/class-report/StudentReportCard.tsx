import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { StudentReportCardProps } from '@/mockData/classReportMock';

const StudentReportCard: React.FC<StudentReportCardProps> = ({
  student,
  onScoreChange,
  onAssessmentChange,
  className
}) => {
  const { index, name, studentId, scores, assessment } = student;

  const handleScoreChange = (type: keyof typeof scores, value: string) => {
    const numValue = parseInt(value) || 0;
    onScoreChange(type, numValue);
  };

  const handleAssessmentChange = (value: string) => {
    onAssessmentChange(value);
  };

  return (
    <Card className={cn(
      "bg-white border border-black/20 shadow-[5px_4px_4px_0px_rgba(0,0,0,0.25)] transition-all duration-300 ease-in-out",
      "w-full rounded-[15px] p-6",
      className
    )}>
      <CardContent className="p-0">
        {/* Student Information Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="text-[30px] font-semibold text-black leading-[1.4em] font-comfortaa text-center">
            {index}. {name}
          </div>
          <div className="text-[24px] font-semibold text-black/50 leading-[1.4em] font-comfortaa text-center">
            ID: {studentId}
          </div>
        </div>

        {/* Scores Section */}
        <div className="flex flex-col gap-3 mb-6">
          <div className="flex items-center gap-4">
            <span className="text-[20px] font-semibold text-black leading-[1.4em] font-comfortaa w-24">
              Homework:
            </span>
            <Input
              type="number"
              value={scores.homework}
              onChange={(e) => handleScoreChange('homework', e.target.value)}
              className="flex-1 h-8 rounded-[8px] border border-black/20 bg-gray-500/50 px-3 text-[16px] font-normal text-black font-comfortaa text-center"
              placeholder="0"
              min="0"
              max="100"
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[20px] font-semibold text-black leading-[1.4em] font-comfortaa w-24">
              Midterm:
            </span>
            <Input
              type="number"
              value={scores.midterm}
              onChange={(e) => handleScoreChange('midterm', e.target.value)}
              className="flex-1 h-8 rounded-[8px] border border-black/20 bg-gray-500/50 px-3 text-[16px] font-normal text-black font-comfortaa text-center"
              placeholder="0"
              min="0"
              max="100"
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[20px] font-semibold text-black leading-[1.4em] font-comfortaa w-24">
              Final:
            </span>
            <Input
              type="number"
              value={scores.final}
              onChange={(e) => handleScoreChange('final', e.target.value)}
              className="flex-1 h-8 rounded-[8px] border border-black/20 bg-gray-500/50 px-3 text-[16px] font-normal text-black font-comfortaa text-center"
              placeholder="0"
              min="0"
              max="100"
            />
          </div>
        </div>

        {/* Teacher Assessment Section */}
        <div className="space-y-3">
          <div className="text-[20px] font-semibold text-black leading-[1.4em] font-comfortaa">
            Teacher Assessment
          </div>
          <Textarea
            value={assessment}
            onChange={(e) => handleAssessmentChange(e.target.value)}
            placeholder="Write your assessment here..."
            className="w-full h-32 rounded-[15px] border border-black/20 bg-gray-200/20 px-4 py-3 text-[16px] font-semibold text-black/50 font-comfortaa resize-none focus:outline-none focus:border-black focus:ring-0"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentReportCard; 