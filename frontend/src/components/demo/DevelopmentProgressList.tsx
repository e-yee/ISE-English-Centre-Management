import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Clock, AlertCircle, Play, Eye, ExternalLink } from 'lucide-react';

interface DevelopmentItem {
  id: string;
  name: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending' | 'blocked';
  priority: 'high' | 'medium' | 'low';
  category: string;
  lastUpdated: string;
  demoAvailable: boolean;
  demoComponent?: React.ComponentType;
}

interface DevelopmentProgressListProps {
  items: DevelopmentItem[];
  onViewDemo: (item: DevelopmentItem) => void;
  onViewDetails: (item: DevelopmentItem) => void;
}

const getStatusIcon = (status: DevelopmentItem['status']) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'in-progress':
      return <Play className="w-5 h-5 text-blue-500" />;
    case 'pending':
      return <Clock className="w-5 h-5 text-yellow-500" />;
    case 'blocked':
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    default:
      return <Circle className="w-5 h-5 text-gray-400" />;
  }
};

const getStatusBadge = (status: DevelopmentItem['status']) => {
  const variants = {
    completed: 'bg-green-100 text-green-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
    blocked: 'bg-red-100 text-red-800'
  };
  
  return (
    <Badge className={variants[status]}>
      {status.replace('-', ' ')}
    </Badge>
  );
};

const getPriorityBadge = (priority: DevelopmentItem['priority']) => {
  const variants = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-orange-100 text-orange-800',
    low: 'bg-gray-100 text-gray-800'
  };
  
  return (
    <Badge className={variants[priority]}>
      {priority}
    </Badge>
  );
};

const DevelopmentProgressList: React.FC<DevelopmentProgressListProps> = ({ 
  items, 
  onViewDemo, 
  onViewDetails 
}) => {
  return (
    <div className="space-y-1">
      <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-gray-500 border-b">
        <div className="col-span-4">Component/Page</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Priority</div>
        <div className="col-span-2">Category</div>
        <div className="col-span-1">Updated</div>
        <div className="col-span-1">Actions</div>
      </div>
      
      {items.map((item) => (
        <div
          key={item.id}
          className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-50 rounded-lg border border-gray-100"
        >
          <div className="col-span-4 flex items-center gap-3">
            {getStatusIcon(item.status)}
            <div className="flex flex-col">
              <span className="font-medium text-gray-900">{item.name}</span>
              <span className="text-sm text-gray-500">{item.description}</span>
            </div>
          </div>
          
          <div className="col-span-2 flex items-center">
            {getStatusBadge(item.status)}
          </div>
          
          <div className="col-span-2 flex items-center">
            {getPriorityBadge(item.priority)}
          </div>
          
          <div className="col-span-2 flex items-center text-sm text-gray-600">
            {item.category}
          </div>
          
          <div className="col-span-1 flex items-center text-sm text-gray-500">
            {item.lastUpdated}
          </div>
          
          <div className="col-span-1 flex items-center gap-1">
            {item.demoAvailable && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onViewDemo(item)}
                title="View Demo"
              >
                <Eye className="w-4 h-4" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onViewDetails(item)}
              title="View Details"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DevelopmentProgressList; 