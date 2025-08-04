import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';
import ContractForm from '@/components/contract/ContractForm';
import ContractGrid from '@/components/contract/ContractGrid';
import type { Contract } from '@/types/contract';
import { mockContracts } from '@/mockData/contractMock';

const ContractPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [contracts, setContracts] = useState<Contract[]>(mockContracts);

  const handleAddContract = (newContract: Contract) => {
    setContracts(prev => [...prev, newContract]);
    setIsFormOpen(false);
  };

  return (
    <div className="h-full bg-background p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Contract Management</h1>
            <p className="text-muted-foreground">Manage and add new contracts to your system</p>
          </div>
          
          <Button 
            className="flex items-center gap-2"
            onClick={() => setIsFormOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add Contract
          </Button>
        </div>

        {/* Contract Grid */}
        <ContractGrid contracts={contracts} />

        {/* Contract Form Dialog */}
        <ContractForm 
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={handleAddContract}
        />
      </div>
    </div>
  );
};

export default ContractPage; 