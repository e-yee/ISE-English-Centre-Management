import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, FileText, AlertCircle, ArrowLeft } from 'lucide-react';
import ContractForm from '@/components/contract/ContractForm';
import ContractGrid from '@/components/contract/ContractGrid';
import { useContracts, useCreateContract, useUpdateContract } from '@/hooks/entities/useContracts';
import { useCourses } from '@/hooks/entities/useCourses';
import type { Contract, CreateContractData, ContractResponse, UpdateContractData } from '@/types/contract';
import type { Course } from '@/types/course';
import { getUserRole } from '@/lib/utils';

const ContractPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  
  // Fetch courses to get the selected course details
  const { data: courses, isLoading: coursesLoading, error: coursesError } = useCourses();
  const selectedCourse = courses?.find(c => c.id === courseId);
  
  // Fetch contracts for selected course
  const { 
    data: contracts, 
    isLoading: contractsLoading, 
    error: contractsError,
    refetch: refetchContracts 
  } = useContracts(
    courseId, 
    selectedCourse?.created_date ? new Date(selectedCourse.created_date).toISOString().split('T')[0] : undefined
  );
  
  // Create contract hook
  const { createContract, isCreating, error: createError } = useCreateContract();
  
  // Update contract hook
  const { updateContract, isUpdating, error: updateError } = useUpdateContract();

  const handleAddContract = async (contractData: CreateContractData) => {
    const result = await createContract(contractData);
    if (result) {
      setIsFormOpen(false);
      setEditingContract(null);
      // Refetch contracts to show the new one
      refetchContracts();
    }
  };

  const handleUpdateContract = async (contractData: UpdateContractData) => {
    if (!editingContract) return;
    
    const result = await updateContract(editingContract.id, contractData);
    if (result) {
      setIsFormOpen(false);
      setEditingContract(null);
      // Refetch contracts to show the updated one
      refetchContracts();
    }
  };

  const handleEditContract = (contract: Contract) => {
    setEditingContract(contract);
    setIsFormOpen(true);
  };

  const handleBackToCourses = () => {
    navigate('/dashboard');
  };

  const handleFormSubmit = async (contractData: CreateContractData | UpdateContractData) => {
    if (editingContract) {
      // Update mode
      await handleUpdateContract(contractData as UpdateContractData);
    } else {
      // Create mode
      await handleAddContract(contractData as CreateContractData);
    }
  };

  // Convert ContractResponse to Contract for display
  const convertContracts = (contractResponses: ContractResponse[]): Contract[] => {
    return contractResponses.map(contract => ({
      ...contract,
      course_date: new Date(contract.course_date),
    }));
  };

  const userRole = getUserRole();
  const isManager = userRole === 'Manager';

  if (!courseId) {
    return (
      <div className="h-full bg-background p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              Course Not Found
            </h3>
            <p className="text-sm text-muted-foreground">
              The course you're looking for doesn't exist.
            </p>
            <Button onClick={handleBackToCourses} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-background p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={handleBackToCourses}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Courses
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Contract Management</h1>
              <p className="text-muted-foreground">
                {selectedCourse ? `Contracts for ${selectedCourse.name}` : 'Loading course...'}
              </p>
            </div>
          </div>
          
          {!isManager && (
            <Button 
              className="flex items-center gap-2"
              onClick={() => {
                setEditingContract(null);
                setIsFormOpen(true);
              }}
              disabled={!selectedCourse}
            >
              <Plus className="h-4 w-4" />
              Add Contract
            </Button>
          )}
        </div>

        {/* Error Messages */}
        {coursesError && (
          <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-800">Failed to load course: {coursesError.message}</span>
            </div>
          </div>
        )}
        
        {contractsError && (
          <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-800">Failed to load contracts: {contractsError.message}</span>
            </div>
          </div>
        )}

        {/* Contract Grid */}
        {selectedCourse ? (
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Contracts for {selectedCourse.name}</h2>
              <p className="text-sm text-muted-foreground">
                {contractsLoading ? 'Loading contracts...' : `${contracts?.length || 0} contracts found`}
              </p>
            </div>
            <ContractGrid 
              contracts={convertContracts(contracts || [])} 
              isLoading={contractsLoading}
              onContractUpdated={refetchContracts}
              onEditContract={handleEditContract}
            />
          </div>
        ) : coursesLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">Loading course...</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              Course Not Found
            </h3>
            <p className="text-sm text-muted-foreground">
              The course you're looking for doesn't exist.
            </p>
          </div>
        )}

        {/* Contract Form Dialog */}
        <ContractForm 
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={handleFormSubmit}
          selectedCourse={selectedCourse || null}
          isCreating={isCreating || isUpdating}
          error={createError || updateError}
          editingContract={editingContract}
        />
      </div>
    </div>
  );
};

export default ContractPage; 