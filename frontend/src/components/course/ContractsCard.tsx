import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Calendar, DollarSign, User, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import type { Contract } from '@/types/contract';
import { mockStudents } from '@/mockData/studentMock';
import { mockEmployees } from '@/mockData/employeeMock';

interface ContractsCardProps {
  contracts: Contract[];
  courseId: string;
  onClick?: () => void;
  summaryOnly?: boolean;
}

const ContractsCard: React.FC<ContractsCardProps> = ({ contracts, courseId, onClick, summaryOnly }) => {
  const filteredContracts = contracts.filter(contract => contract.course_id === courseId);

  // Helper functions to get display names
  const getStudentName = (studentId: string) => {
    const student = mockStudents.find(s => s.id === studentId);
    return student ? student.fullname : studentId;
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = mockEmployees.find(e => e.id === employeeId);
    return employee ? employee.fullname : employeeId;
  };

  const getPaymentStatusIcon = (status: string) => {
    return status === 'Paid' ? CheckCircle : Clock;
  };

  const getPaymentStatusColor = (status: string) => {
    return status === 'Paid' ? 'text-green-600 bg-green-50' : 'text-yellow-600 bg-yellow-50';
  };

  if (summaryOnly) {
    return (
      <Card
        className="border-2 border-purple-200 bg-gradient-to-br from-white to-purple-50 cursor-pointer hover:shadow-lg transition-all"
        onClick={onClick}
        role="button"
        tabIndex={0}
      >
        <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b flex flex-row items-center gap-3">
          <FileText className="h-8 w-8 text-purple-600" />
          <div>
            <CardTitle className="text-lg font-bold text-gray-800">Contracts</CardTitle>
            <CardDescription className="text-purple-600">
              {filteredContracts.length > 0 ? `${filteredContracts.length} contract${filteredContracts.length !== 1 ? 's' : ''}` : ''}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className="text-sm text-gray-600">Click to view all contracts for this course</p>
        </CardContent>
      </Card>
    );
  }

  if (filteredContracts.length === 0) {
    return (
      <Card className="border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-gray-600" />
            <div>
              <CardTitle className="text-lg font-bold text-gray-800">Contracts</CardTitle>
              <CardDescription className="text-gray-600">No contracts found for this course</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className="text-sm text-gray-500">No contracts have been created for this course yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-white to-purple-50">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-purple-600" />
          <div>
            <CardTitle className="text-lg font-bold text-gray-800">Contracts</CardTitle>
            <CardDescription className="text-purple-600">
              {filteredContracts.length} contract{filteredContracts.length !== 1 ? 's' : ''} found
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {filteredContracts.map((contract) => {
            const PaymentStatusIcon = getPaymentStatusIcon(contract.payment_status);
            return (
              <div 
                key={contract.id}
                className="border border-purple-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">
                    {contract.contract_number || `Contract ${contract.id}`}
                  </h4>
                  <span className={`text-sm font-bold px-2 py-1 rounded flex items-center gap-1 ${getPaymentStatusColor(contract.payment_status)}`}>
                    <PaymentStatusIcon className="h-3 w-3" />
                    {contract.payment_status}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">{getStudentName(contract.student_id)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">${contract.tuition_fee}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">
                      {format(contract.start_date, "MMM dd, yyyy")} - {format(contract.end_date, "MMM dd, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">{getEmployeeName(contract.employee_id)}</span>
                  </div>
                </div>
                
                {contract.description && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                      {contract.description}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractsCard; 