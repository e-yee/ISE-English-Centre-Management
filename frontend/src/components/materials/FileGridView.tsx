import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Star, Share, FileText, ImageIcon, Video, Music, Archive, Folder } from 'lucide-react';
import type { FileItem, FileType } from '@/hooks/useFileManagement';

interface FileGridViewProps {
  files: FileItem[];
  onFileSelect: (id: string) => void;
  selectedFiles: string[];
  onFolderClick: (id: string) => void;
}

const getFileIcon = (type: FileType, isFolder: boolean) => {
    if (isFolder) return <Folder className="w-10 h-10 text-purple-600" />
  
    switch (type) {
      case "pdf":
        return <FileText className="w-10 h-10 text-red-500" />
      case "image":
        return <ImageIcon className="w-10 h-10 text-green-500" />
      case "video":
        return <Video className="w-10 h-10 text-blue-500" />
      case "audio":
        return <Music className="w-10 h-10 text-orange-500" />
      case "archive":
        return <Archive className="w-10 h-10 text-yellow-500" />
      default:
        return <FileText className="w-10 h-10 text-gray-500" />
    }
}

const FileGridView: React.FC<FileGridViewProps> = ({ files, onFileSelect, selectedFiles, onFolderClick }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {files.map((file) => (
        <Card
          key={file.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedFiles.includes(file.id) ? "ring-2 ring-purple-500" : ""
          }`}
          onClick={() => onFileSelect(file.id)}
          onDoubleClick={() => file.isFolder && onFolderClick(file.id)}
        >
          <CardContent className="p-4 text-center">
            <div className="flex justify-center mb-2">{getFileIcon(file.type, file.isFolder)}</div>
            <div className="space-y-1">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-gray-500">{file.size}</p>
              <div className="flex justify-center gap-1">
                {file.starred && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                {file.shared && <Share className="w-3 h-3 text-blue-500" />}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FileGridView; 