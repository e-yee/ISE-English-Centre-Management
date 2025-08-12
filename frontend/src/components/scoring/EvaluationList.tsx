import React from 'react';
import { cn } from '@/lib/utils';
import type { AssessmentType } from './EvaluationForm';
import { Card, CardContent } from '@/components/ui/card';

export interface EvaluationRow {
  assessment_type: AssessmentType;
  course_date: string; // YYYY-MM-DD (class session date)
  evaluation_date?: string; // YYYY-MM-DD (when teacher evaluated)
  grade: string;
  comment: string;
}

interface EvaluationListProps {
  items: EvaluationRow[];
  className?: string;
  onSelect?: (row: EvaluationRow) => void;
}

export const EvaluationList: React.FC<EvaluationListProps> = ({ items, className, onSelect }) => {
  return (
    <Card className={cn('bg-white border border-gray-200 shadow-sm rounded-[15px]', className)}>
      <CardContent className="p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2 pr-4">Assessment</th>
                <th className="py-2 pr-4">Evaluated on</th>
                <th className="py-2 pr-4">Grade</th>
                <th className="py-2 pr-4">Comment</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <tr
                  key={idx}
                  className={cn('border-t', onSelect ? 'cursor-pointer hover:bg-gray-50' : '')}
                  onClick={() => onSelect?.(it)}
                >
                  <td className="py-2 pr-4">{it.assessment_type}</td>
                  <td className="py-2 pr-4">{it.evaluation_date || it.course_date}</td>
                  <td className="py-2 pr-4">{it.grade}</td>
                  <td className="py-2 pr-4 max-w-[420px] truncate" title={it.comment}>{it.comment}</td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td className="py-6 text-center text-gray-500" colSpan={4}>No evaluations yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default EvaluationList;


