import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Student } from '@/mockData/scoringMock';

interface StudentRowProps {
  student: Student;
  onScoreUpdate: (studentId: string, quarter: string, score: number) => void;
  onNotesUpdate: (studentId: string, notes: string) => void;
  columns?: { key: keyof Student['scores']; label: string }[];
}

const StudentRow: React.FC<StudentRowProps> = ({ student, onScoreUpdate, onNotesUpdate, columns }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editedScores, setEditedScores] = useState(student.scores);
  const [editedNotes, setEditedNotes] = useState(student.notes);

  const handleScoreChange = (quarter: string, value: string) => {
    const score = parseInt(value) || 0;
    setEditedScores(prev => ({ ...prev, [quarter]: score }));
  };

  const handleSave = () => {
    // Update scores
    Object.entries(editedScores).forEach(([quarter, score]) => {
      if (score !== student.scores[quarter as keyof typeof student.scores]) {
        onScoreUpdate(student.id, quarter, score);
      }
    });

    // Update notes
    if (editedNotes !== student.notes) {
      onNotesUpdate(student.id, editedNotes);
    }

    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedScores(student.scores);
    setEditedNotes(student.notes);
    setIsEditing(false);
  };

  const calculateAverage = (scores: typeof student.scores) => {
    const values = Object.values(scores);
    return Math.round(values.reduce((sum, score) => sum + score, 0) / values.length);
  };

  const getScoreBackground = (quarter: string) => {
    if (isEditing) return 'bg-gray-100';
    // Alternate background colors for visual distinction
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'];
    const index = quarters.indexOf(quarter);
    return index % 2 === 0 ? 'bg-white' : 'bg-gray-100';
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out rounded-[15px]">
      <CardContent className="p-6">
        {/* Main Row */}
        <div className="flex items-center justify-between">
          {/* Left Side - Student Info and Expand Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-center w-6 h-6 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            <div>
              <h3 className="text-lg font-bold text-black font-comfortaa">{student.name}</h3>
              <p className="text-sm text-gray-500 font-comfortaa">ID: {student.id}</p>
            </div>
          </div>

          {/* Right Side - Scores */}
          <div className="flex items-center gap-2">
            {(columns
              ? columns.map(c => [c.key, (isEditing ? editedScores : student.scores)[c.key]] as const)
              : (Object.entries(isEditing ? editedScores : student.scores) as [keyof Student['scores'], number][]) 
            ).map(([quarter, score]) => (
              <div key={String(quarter)} className="text-center">
                <div className={cn(
                  "px-3 py-1 rounded-md text-sm font-medium font-comfortaa",
                  getScoreBackground(String(quarter))
                )}>
                  <div className="text-xs text-gray-500 font-comfortaa">{columns ? columns.find(c => c.key === quarter)?.label : String(quarter)}</div>
                  {isEditing ? (
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={score}
                      onChange={(e) => handleScoreChange(String(quarter), e.target.value)}
                      className="w-12 h-8 text-center text-sm font-comfortaa p-1"
                    />
                  ) : (
                    <div className="text-sm font-bold text-black font-comfortaa">{score}</div>
                  )}
                </div>
              </div>
            ))}
            
                         {/* Overall Score */}
             <div className="text-center ml-2">
               <div className="bg-[#D95151] text-white px-3 py-1 rounded-md" style={{ backgroundColor: '#732B2BD9' }}>
                 <div className="text-xs font-comfortaa">OVERALL</div>
                 <div className="text-sm font-bold font-comfortaa">
                   {calculateAverage(isEditing ? editedScores : student.scores)}
                 </div>
               </div>
             </div>

            {/* Edit Button */}
            <Button
              variant={isEditing ? "default" : "outline"}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="font-comfortaa ml-2"
            >
              {isEditing ? "Save" : "Edit"}
            </Button>
          </div>
        </div>

        {/* Expanded Notes Section */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-md font-bold text-purple-600 mb-3 font-comfortaa">Notes</h4>
            {isEditing ? (
              <Textarea
                value={editedNotes}
                onChange={(e) => setEditedNotes(e.target.value)}
                placeholder="Add notes about the student..."
                className="min-h-[100px] font-comfortaa"
              />
            ) : (
              <div className="min-h-[100px] p-3 bg-gray-50 rounded-md border border-gray-200">
                <p className="text-sm text-gray-700 font-comfortaa whitespace-pre-wrap">
                  {student.notes || "No notes available"}
                </p>
              </div>
            )}

            {/* Action Buttons for Notes */}
            {isEditing && (
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  className="font-comfortaa"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="font-comfortaa"
                >
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentRow; 