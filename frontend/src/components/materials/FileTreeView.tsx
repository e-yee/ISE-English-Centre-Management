import React from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, Trash2, MoreHorizontal, Eye, Share, Star, FileText, ImageIcon, Video, Music, Archive, Folder, ChevronRight, ChevronDown } from 'lucide-react';
import type { FileItem, FileType } from '@/hooks/useFileManagement';

type TreeFileItem = FileItem & { children: TreeFileItem[] };

interface FileTreeViewProps {
    tree: TreeFileItem[];
    onFileSelect: (id: string) => void;
    selectedFiles: string[];
    expandedFolders: string[];
    onToggleFolder: (id: string) => void;
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

const TreeItem: React.FC<{
    item: TreeFileItem;
    level: number;
    onFileSelect: (id: string) => void;
    selectedFiles: string[];
    expandedFolders: string[];

    onToggleFolder: (id: string) => void;
}> = ({ item, level, onFileSelect, selectedFiles, expandedFolders, onToggleFolder }) => {
    const isExpanded = expandedFolders.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const isSelected = selectedFiles.includes(item.id);

    return (
        <div>
            <div
                className={`group flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer ${
                    isSelected ? "bg-purple-50 border border-purple-200" : ""
                }`}
                style={{ paddingLeft: `${12 + level * 24}px` }}
                onClick={() => onFileSelect(item.id)}
            >
                {item.isFolder && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleFolder(item.id);
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                    >
                        {hasChildren ? (
                            isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                        ) : (
                            <div className="w-4 h-4" />
                        )}
                    </button>
                )}

                {!item.isFolder && <div className="w-6" />}

                <div className="flex-shrink-0">{getFileIcon(item.type, item.isFolder)}</div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{item.name}</span>
                        <div className="flex gap-1">
                            {item.starred && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                            {item.shared && <Share className="w-3 h-3 text-blue-500" />}
                        </div>
                    </div>
                    <div className="text-xs text-gray-500">
                        {item.size} • {item.uploadDate}
                    </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                        <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
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

            {item.isFolder && isExpanded && hasChildren && (
                <div>{item.children.map((child) => <TreeItem key={child.id} item={child} level={level + 1} onFileSelect={onFileSelect} selectedFiles={selectedFiles} expandedFolders={expandedFolders} onToggleFolder={onToggleFolder} />)}</div>
            )}
        </div>
    );
};


const FileTreeView: React.FC<FileTreeViewProps> = ({ tree, ...props }) => {
  return (
    <div className="space-y-1">
      {tree.map((item) => (
        <TreeItem key={item.id} item={item} level={0} {...props} />
      ))}
    </div>
  );
};

export default FileTreeView; 