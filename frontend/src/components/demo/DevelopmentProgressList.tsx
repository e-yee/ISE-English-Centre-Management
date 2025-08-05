import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Circle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProgressItem {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  demoPath?: string;
  component?: React.ComponentType;
}

const progressItems: ProgressItem[] = [
  {
    id: 'auth',
    title: 'Authentication System',
    description: 'Login, registration, and password reset functionality',
    status: 'completed',
    demoPath: '/demo/auth'
  },
  {
    id: 'homescreen',
    title: 'Homescreen Dashboard',
    description: 'Main dashboard with overview and quick actions',
    status: 'completed',
    demoPath: '/demo/homescreen'
  },
  {
    id: 'attendance',
    title: 'Attendance Management',
    description: 'Student attendance tracking and reporting',
    status: 'completed',
    demoPath: '/demo/attendance'
  },
  {
    id: 'class-information',
    title: 'Class Information',
    description: 'Detailed class view with student list and materials',
    status: 'completed',
    demoPath: '/demo/class-information'
  },
  {
    id: 'class-screen',
    title: 'Class Screen',
    description: 'Active class session with real-time features',
    status: 'completed',
    demoPath: '/demo/class-screen'
  },
  {
    id: 'contract',
    title: 'Contract Management',
    description: 'Contract creation, viewing, and management system',
    status: 'completed',
    demoPath: '/demo/contract'
  },
  {
    id: 'course',
    title: 'Course Management',
    description: 'Course creation and management interface',
    status: 'in-progress',
    demoPath: '/demo/course'
  },
  {
    id: 'timekeeping',
    title: 'Timekeeping System',
    description: 'Employee time tracking and check-in system',
    status: 'in-progress',
    demoPath: '/demo/timekeeping'
  },
  {
    id: 'scoring',
    title: 'Student Scoring',
    description: 'Student evaluation and scoring system',
    status: 'pending',
    demoPath: '/demo/scoring'
  },
  {
    id: 'colleagues',
    title: 'Colleagues Management',
    description: 'Employee directory and profile management',
    status: 'pending',
    demoPath: '/demo/colleagues'
  },
  {
    id: 'absent-request',
    title: 'Absent Request System',
    description: 'Leave request and approval workflow',
    status: 'pending',
    demoPath: '/demo/absent-request'
  },
  {
    id: 'materials',
    title: 'Materials Management',
    description: 'File upload and material organization system',
    status: 'pending',
    demoPath: '/demo/materials'
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case 'in-progress':
      return <Clock className="h-5 w-5 text-yellow-600" />;
    case 'pending':
      return <Circle className="h-5 w-5 text-gray-400" />;
    default:
      return <Circle className="h-5 w-5 text-gray-400" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'border-green-200 bg-green-50';
    case 'in-progress':
      return 'border-yellow-200 bg-yellow-50';
    case 'pending':
      return 'border-gray-200 bg-gray-50';
    default:
      return 'border-gray-200 bg-gray-50';
  }
};

const DevelopmentProgressList: React.FC = () => {
  return (
    <div className="h-full bg-background p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Development Progress</h1>
          <p className="text-muted-foreground">Track the development status of all features</p>
        </div>

        {/* Progress Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {progressItems.map((item) => (
            <Card 
              key={item.id}
              className={`hover:shadow-lg transition-all duration-300 cursor-pointer ${getStatusColor(item.status)}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                  {getStatusIcon(item.status)}
                </div>
                <CardDescription className="text-sm">
                  {item.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    item.status === 'completed' ? 'bg-green-100 text-green-800' :
                    item.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.status.replace('-', ' ')}
                  </span>
                  {item.demoPath && (
                    <Link 
                      to={item.demoPath}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Demo →
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DevelopmentProgressList; 