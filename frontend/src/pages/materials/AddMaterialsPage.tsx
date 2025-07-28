import React from 'react';
import { cn } from '@/lib/utils';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import FeatureButtonList from '@/components/class/FeatureButtonList';
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar';
import FileToolbar from '@/components/materials/FileToolbar';
import FileListView from '@/components/materials/FileListView';
import FileGridView from '@/components/materials/FileGridView';
import FileTreeView from '@/components/materials/FileTreeView';
import { useFileManagement } from '@/hooks/useFileManagement';
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

const AddMaterialsPageContent: React.FC<AddMaterialsPageProps> = ({ className, classId = "CL001" }) => {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";

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
    <div className={cn("h-screen w-screen bg-gray-50 overflow-hidden font-comfortaa", className)}>
      <div className="w-full h-20">
        <Header isRegistered={true} />
      </div>
      <div className="relative h-[calc(100vh-5rem)]">
        <div className="absolute left-0 top-0 h-full">
          <Sidebar />
        </div>
        <div className={cn("h-full transition-all duration-300 ease-in-out overflow-hidden flex flex-col", isExpanded ? "ml-[335px]" : "ml-[120px]")}>
            <div className={cn("pt-4 pb-3 flex-shrink-0 transition-all duration-300 ease-in-out", "px-4")}>
                <FeatureButtonList />
            </div>
            
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
        </div>
      </div>
      <DriveUploadToast items={items} onRemoveItem={removeItem} onClearAll={clearAll} />
    </div>
  );
};

const AddMaterialsPage: React.FC<AddMaterialsPageProps> = ({ className }) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <AddMaterialsPageContent className={className} />
    </SidebarProvider>
  );
};

export default AddMaterialsPage; 