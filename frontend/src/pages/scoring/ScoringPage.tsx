import React from 'react';
import { useParams } from 'react-router-dom';
import ScoreList from '@/components/scoring/ScoreList';

interface ScoringPageProps {
  className?: string;
}

const ScoringPage: React.FC<ScoringPageProps> = ({ className }) => {
  const { classId } = useParams<{ classId: string }>();

  if (!classId) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-2xl font-semibold text-gray-600 mb-2">Class ID Required</div>
          <div className="text-gray-500">Please provide a valid class ID.</div>
        </div>
      </div>
    );
  }

  return <ScoreList classId={classId} className={className} />;
};

export default ScoringPage; 