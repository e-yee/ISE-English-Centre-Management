import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Loader2, Edit } from 'lucide-react';
import { format } from 'date-fns';
import type { Contract } from '@/types/contract';
import { mockStudents } from '@/mockData/studentMock';

interface ContractGridProps {
  contracts: Contract[];
  isLoading?: boolean;
  onContractUpdated?: () => void;
  onEditContract?: (contract: Contract) => void;
}

const ContractGrid: React.FC<ContractGridProps> = ({ 
  contracts, 
  isLoading = false,
  onContractUpdated,
  onEditContract
}) => {
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

  const handleEditContract = (e: React.MouseEvent, contract: Contract) => {
    e.stopPropagation();
    if (onEditContract) {
      onEditContract(contract);
    }
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

  const getCourseName = (courseId: string) => {
    // Use the course ID directly since we're getting real data from backend
    return courseId;
  };

  // Helper function to safely format dates
  const formatDate = (dateValue: Date | string) => {
    try {
      const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return format(date, "MMM dd, yyyy");
    } catch (error) {
      console.error('Error formatting date:', dateValue, error);
      return 'Invalid Date';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading contracts...</span>
      </div>
    );
  }

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
      {contracts.map((contract, index) => {
        const isExpanded = expandedCards.has(contract.id);
        return (
          <Card 
            key={contract.id || `contract-${index}`} 
            className="hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 bg-gradient-to-br from-white to-gray-50 cursor-pointer"
            onClick={() => toggleCardExpansion(contract.id)}
          >
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-800">
                    Contract {contract.id || 'N/A'}
                  </CardTitle>
                  <CardDescription className="text-blue-600 font-medium">
                    Student ID: {contract.student_id || 'N/A'}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {onEditContract && (
                    <button 
                      className="p-1 hover:bg-blue-100 rounded transition-colors"
                      onClick={(e) => handleEditContract(e, contract)}
                      title="Edit Contract"
                    >
                      <Edit className="h-4 w-4 text-blue-600" />
                    </button>
                  )}
                </div>
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
              <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Course Date:</span>
                <span className="text-sm font-bold text-gray-600">{formatDate(contract.course_date)}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Payment Status:</span>
                <span className={`text-sm font-bold px-2 py-1 rounded ${getPaymentStatusColor(contract.payment_status)}`}>
                  {contract.payment_status}
                </span>
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