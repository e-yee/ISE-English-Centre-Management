import React from 'react';
import ScoreList from '@/components/scoring/ScoreList';
import DemoLayout from '@/components/demo/DemoLayout';

interface ScoringDemoPageProps {
  className?: string;
}

const ScoringDemoPage: React.FC<ScoringDemoPageProps> = ({ className }) => {
  // Use existing mock classId from scoringMock.ts
  const demoClassId = '1';

  return (
    <DemoLayout>
      <ScoreList classId={demoClassId} className={className} />
    </DemoLayout>
  );
};

export default ScoringDemoPage;


