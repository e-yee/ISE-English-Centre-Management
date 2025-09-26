import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Grid3X3, List, TreePine, FolderPlus, Upload } from "lucide-react";
import type { ViewMode } from '@/hooks/useFileManagement';

interface FileToolbarProps {
  viewMode: ViewMode;
  onViewChange: (viewMode: ViewMode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddFile: () => void;
  onAddFolder: () => void;
}

const FileToolbar: React.FC<FileToolbarProps> = ({
  viewMode,
  onViewChange,
  searchQuery,
  onSearchChange,
  onAddFile,
  onAddFolder,
}) => {
  return (
    <div className="flex items-center justify-between pb-4">
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button style={{ backgroundColor: '#684997' }}>
              <FolderPlus className="w-4 h-4 mr-2" />
              Add Materials
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onAddFile}>
              <Upload className="w-4 h-4 mr-2" />
              Upload File
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onAddFolder}>
              <FolderPlus className="w-4 h-4 mr-2" />
              Create Folder
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === 'list' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => onViewChange('list')}
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => onViewChange('grid')}
        >
          <Grid3X3 className="w-4 h-4" />
        </Button>
        <Button
          variant={viewMode === 'tree' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => onViewChange('tree')}
        >
          <TreePine className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default FileToolbar; 