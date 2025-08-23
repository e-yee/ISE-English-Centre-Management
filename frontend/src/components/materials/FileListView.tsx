import React from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, Trash2, MoreHorizontal, Eye, Share, Star, FileText, ImageIcon, Video, Music, Archive, Folder } from 'lucide-react';
import type { FileItem, FileType } from '@/hooks/useFileManagement';

interface FileListViewProps {
  files: FileItem[];
  onFileSelect: (id: string) => void;
  selectedFiles: string[];
  onFolderClick: (id: string) => void;
}

const getFileIcon = (type: FileType, isFolder: boolean) => {
    if (isFolder) return <Folder className="w-5 h-5 text-purple-600" />
  
    switch (type) {
      case "pdf":
        return <FileText className="w-5 h-5 text-red-500" />
      case "image":
        return <ImageIcon className="w-5 h-5 text-green-500" />
      case "video":
        return <Video className="w-5 h-5 text-blue-500" />
      case "audio":
        return <Music className="w-5 h-5 text-orange-500" />
      case "archive":
        return <Archive className="w-5 h-5 text-yellow-500" />
      default:
        return <FileText className="w-5 h-5 text-gray-500" />
    }
}

const FileListView: React.FC<FileListViewProps> = ({ files, onFileSelect, selectedFiles, onFolderClick }) => {
  return (
    <div className="space-y-1">
      <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-gray-500 border-b">
        <div className="col-span-6">Name</div>
        <div className="col-span-2">Size</div>
        <div className="col-span-2">Modified</div>
        <div className="col-span-2">Actions</div>
      </div>
      {files.map((file) => (
        <div
          key={file.id}
          className={`grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-50 rounded-lg cursor-pointer ${
            selectedFiles.includes(file.id) ? "bg-purple-50 border border-purple-200" : ""
          }`}
          onClick={() => onFileSelect(file.id)}
          onDoubleClick={() => file.isFolder && onFolderClick(file.id)}
        >
          <div className="col-span-6 flex items-center gap-3">
            {getFileIcon(file.type, file.isFolder)}
            <span className="font-medium">{file.name}</span>
            <div className="flex gap-1">
              {file.starred && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
              {file.shared && <Share className="w-3 h-3 text-blue-500" />}
            </div>
          </div>
          <div className="col-span-2 flex items-center text-sm text-gray-500">{file.size}</div>
          <div className="col-span-2 flex items-center text-sm text-gray-500">{file.uploadDate}</div>
          <div className="col-span-2 flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Trash2 className="w-4 h-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Star className="w-4 h-4 mr-2" />
                  Star
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileListView; 