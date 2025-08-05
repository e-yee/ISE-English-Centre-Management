import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import type { Contract } from '@/types/contract';
import { mockStudents } from '@/mockData/studentMock';
import { mockEmployees } from '@/mockData/employeeMock';
import { mockCourses } from '@/mockData/courseMock';

interface ContractGridProps {
  contracts: Contract[];
}

const ContractGrid: React.FC<ContractGridProps> = ({ contracts }) => {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const toggleCardExpansion = (contractId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(contractId)) {
      newExpanded.delete(contractId);
    } else {
      newExpanded.add(contractId);
    }
    setExpandedCards(newExpanded);
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'text-green-600 bg-green-50';
      case 'In Progress':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // Helper function to get display names
  const getStudentName = (studentId: string) => {
    const student = mockStudents.find(s => s.id === studentId);
    return student ? student.fullname : studentId;
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = mockEmployees.find(e => e.id === employeeId);
    return employee ? employee.fullname : employeeId;
  };

  const getCourseName = (courseId: string) => {
    const course = mockCourses.find(c => c.id === courseId);
    return course ? course.name : courseId;
  };

  if (contracts.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No contracts yet</h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first contract using the "Add Contract" button above.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contracts.map((contract) => {
        const isExpanded = expandedCards.has(contract.id);
        return (
          <Card 
            key={contract.id} 
            className="hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 bg-gradient-to-br from-white to-gray-50 cursor-pointer"
            onClick={() => toggleCardExpansion(contract.id)}
          >
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-800">
                    {contract.contract_number || `Contract ${contract.id}`}
                  </CardTitle>
                  <CardDescription className="text-blue-600 font-medium">Contract ID: {contract.id}</CardDescription>
                </div>
                <button 
                  className="p-1 hover:bg-blue-100 rounded transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCardExpansion(contract.id);
                  }}
                >
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-blue-600" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-blue-600" />
                  )}
                </button>
              </div>
            </CardHeader>
            <CardContent className={`space-y-3 p-4 ${isExpanded ? 'max-h-96 overflow-y-auto' : ''}`}>
              <div className="flex justify-between items-center py-2 px-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Student:</span>
                <span className="text-sm font-bold text-blue-600">{getStudentName(contract.student_id)}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Course:</span>
                <span className="text-sm font-bold text-green-600">{getCourseName(contract.course_id)}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Tuition Fee:</span>
                <span className="text-sm font-bold text-purple-600">${contract.tuition_fee}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 bg-orange-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Start Date:</span>
                <span className="text-sm font-bold text-orange-600">{format(contract.start_date, "MMM dd, yyyy")}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 bg-indigo-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">End Date:</span>
                <span className="text-sm font-bold text-indigo-600">{format(contract.end_date, "MMM dd, yyyy")}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Course Date:</span>
                <span className="text-sm font-bold text-gray-600">{format(contract.course_date, "MMM dd, yyyy")}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Payment Status:</span>
                <span className={`text-sm font-bold px-2 py-1 rounded ${getPaymentStatusColor(contract.payment_status)}`}>
                  {contract.payment_status}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 bg-teal-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Employee:</span>
                <span className="text-sm font-bold text-teal-600">{getEmployeeName(contract.employee_id)}</span>
              </div>
              {contract.description && (
                <div className="pt-3 border-t border-gray-200">
                  <span className="text-sm font-medium text-gray-700 block mb-1">Description:</span>
                  <p className={`text-sm text-gray-600 bg-gray-50 p-2 rounded ${isExpanded ? '' : 'line-clamp-3'}`}>
                    {contract.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ContractGrid; 