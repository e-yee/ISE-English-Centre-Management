import React, { useState } from 'react';
import ClassScreen from './ClassScreen';
import { classListMockData } from '@/mockData/classListMock';

const ClassScreenTest: React.FC = () => {
  const [selectedClassId, setSelectedClassId] = useState('CL001');

  return (
    <div>
      {/* Class Selector for Testing */}
      <div className="fixed top-4 right-4 z-50 bg-white p-4 border border-gray-300 rounded shadow">
        <label className="block text-sm font-medium mb-2">Select Class:</label>
        <select 
          value={selectedClassId} 
          onChange={(e) => setSelectedClassId(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        >
          {classListMockData.slice(0, 5).map((classData) => (
            <option key={classData.id} value={classData.id}>
              {classData.className}
            </option>
          ))}
        </select>
      </div>

      {/* Class Screen */}
      <ClassScreen classId={selectedClassId} />
    </div>
  );
};

export default ClassScreenTest;
