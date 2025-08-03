import React from 'react';
import { cn } from '@/lib/utils';
import FeatureButtonList from '@/components/class/FeatureButtonList';
import FileToolbar from '@/components/materials/FileToolbar';
import FileListView from '@/components/materials/FileListView';
import FileGridView from '@/components/materials/FileGridView';
import FileTreeView from '@/components/materials/FileTreeView';
import { useFileManagement } from '@/hooks/ui/useFileManagement';
import DriveUploadToast from '@/components/ui/UploadToast';
import { useUploadStore, useUploadSimulation } from '@/hooks/useUpload';
import ClassInfo from '@/components/class/ClassInfo';
import { classListMockData } from '@/mockData/classListMock';
import { getFormattedStudentCount } from '@/mockData/studentListMock';
import Breadcrumb from '@/components/materials/Breadcrumb';

interface AddMaterialsPageProps {
  className?: string;
  classId?: string;
}

const AddMaterialsPage: React.FC<AddMaterialsPageProps> = ({ className, classId = "CL001" }) => {
  const {
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    selectedFiles,
    handleFileSelect,
    filteredFiles,
    buildTreeStructure,
    treeData,
    expandedFolders,
    toggleFolder,
    navigateToFolder,
    currentPath,
  } = useFileManagement();

  const { items, addItem, updateItem, removeItem, clearAll } = useUploadStore();
  const simulateUpload = useUploadSimulation(updateItem);

  const handleAddFile = () => {
    const fileType = "pdf";
    const fileName = `new_document_${Date.now().toString().slice(-4)}.pdf`;
    const id = addItem(fileName, fileType);
    simulateUpload(id);
  };
  
  const classData = classListMockData.find(cls => cls.id === classId);
  if (!classData) {
    return <div>Class not found</div>;
  }
  const studentCount = getFormattedStudentCount(classId);

  const handleFolderClick = (folderId: string) => {
      navigateToFolder(folderId);
  }

  return (
    <div className={cn("h-full overflow-hidden flex flex-col", className)}>
      
      <div className={cn("pb-3 flex-shrink-0 transition-all duration-300 ease-in-out", "px-4")}>
        <ClassInfo
          classData={classData}
          studentCount={studentCount}
        />
      </div>

      <div className="flex-1 overflow-hidden p-4">
        <div className="w-full h-full bg-white rounded-lg shadow-md p-6 flex flex-col">
          <Breadcrumb path={currentPath} onNavigate={navigateToFolder} />
          <FileToolbar
            viewMode={viewMode}
            onViewChange={setViewMode}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onAddFile={handleAddFile}
            onAddFolder={() => alert("Add folder clicked")}
          />
          <div className="flex-1 overflow-y-auto">
            {viewMode === 'list' && <FileListView files={filteredFiles} onFileSelect={handleFileSelect} selectedFiles={selectedFiles} onFolderClick={handleFolderClick} />}
            {viewMode === 'grid' && <FileGridView files={filteredFiles} onFileSelect={handleFileSelect} selectedFiles={selectedFiles} onFolderClick={handleFolderClick} />}
            {viewMode === 'tree' && <FileTreeView tree={buildTreeStructure(treeData) as any} onFileSelect={handleFileSelect} selectedFiles={selectedFiles} expandedFolders={expandedFolders} onToggleFolder={toggleFolder} />}
          </div>
        </div>
      </div>
      <DriveUploadToast items={items} onRemoveItem={removeItem} onClearAll={clearAll} />
    </div>
  );
};

export default AddMaterialsPage; 