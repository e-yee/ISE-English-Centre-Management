import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbProps {
  path: { id: string | undefined; name: string }[];
  onNavigate: (id: string | undefined) => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ path, onNavigate }) => {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
      <button onClick={() => onNavigate(undefined)} className="flex items-center gap-1 hover:text-gray-800">
        <Home className="w-4 h-4" />
      </button>
      {path.slice(1).map((item, index) => (
        <React.Fragment key={item.id}>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <button
            onClick={() => onNavigate(item.id)}
            className={`hover:text-gray-800 ${index === path.length - 2 ? 'font-medium text-gray-800' : ''}`}
            disabled={index === path.length - 2}
          >
            {item.name}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumb; 