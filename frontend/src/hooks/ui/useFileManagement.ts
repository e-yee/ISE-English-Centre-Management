"use client"

import { useState, useCallback, useRef } from "react"

export type ViewMode = "grid" | "list" | "tree";
export type SortBy = "name" | "date" | "size" | "type";
export type FileType = "pdf" | "image" | "video" | "audio" | "document" | "archive" | "folder";

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size: string;
  uploadDate: string;
  isFolder: boolean;
  parentId?: string;
  starred?: boolean;
  shared?: boolean;
}

export interface UploadProgress {
  id: string;
  name: string;
  progress: number;
  status: "uploading" | "completed" | "error";
}

const allFiles: FileItem[] = [
    { id: "1", name: "Mathematics", type: "folder", size: "12 files", uploadDate: "2025-01-15", isFolder: true },
    { id: "1-1", name: "Algebra", type: "folder", size: "5 files", uploadDate: "2025-01-14", isFolder: true, parentId: "1" },
    { id: "1-1-1", name: "Chapter 1 - Basic Equations.pdf", type: "pdf", size: "1.2 MB", uploadDate: "2025-01-22", isFolder: false, parentId: "1-1" },
    { id: "1-1-2", name: "Chapter 2 - Linear Functions.pdf", type: "pdf", size: "1.8 MB", uploadDate: "2025-01-21", isFolder: false, parentId: "1-1" },
    { id: "1-2", name: "Geometry", type: "folder", size: "4 files", uploadDate: "2025-01-13", isFolder: true, parentId: "1" },
    { id: "1-2-1", name: "Triangles.pdf", type: "pdf", size: "2.1 MB", uploadDate: "2025-01-20", isFolder: false, parentId: "1-2" },
    { id: "1-3", name: "Practice Tests", type: "folder", size: "3 files", uploadDate: "2025-01-12", isFolder: true, parentId: "1" },
    { id: "2", name: "Science", type: "folder", size: "8 files", uploadDate: "2025-01-14", isFolder: true },
    { id: "2-1", name: "Physics", type: "folder", size: "4 files", uploadDate: "2025-01-13", isFolder: true, parentId: "2" },
    { id: "2-1-1", name: "Motion and Forces.pdf", type: "pdf", size: "3.2 MB", uploadDate: "2025-01-19", isFolder: false, parentId: "2-1" },
    { id: "2-2", name: "Chemistry", type: "folder", size: "4 files", uploadDate: "2025-01-12", isFolder: true, parentId: "2" },
    { id: "3", name: "Chapter 1.pdf", type: "pdf", size: "1.5 MB", uploadDate: "2025-01-22", isFolder: false, starred: true },
    { id: "4", name: "Chapter 2.pdf", type: "pdf", size: "2.1 MB", uploadDate: "2025-01-21", isFolder: false },
    { id: "5", name: "Lesson Plan.docx", type: "document", size: "856 KB", uploadDate: "2025-01-20", isFolder: false, shared: true },
    { id: "6", name: "Class Photo.jpg", type: "image", size: "3.2 MB", uploadDate: "2025-01-19", isFolder: false },
];


export const useFileManagement = () => {
    const [viewMode, setViewMode] = useState<ViewMode>("list");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<SortBy>("name");
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
    const [showCreateFolder, setShowCreateFolder] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [expandedFolders, setExpandedFolders] = useState<string[]>(["1", "2"]);
    
    const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(undefined);

    const buildBreadcrumbPath = useCallback((folderId?: string) => {
        const path = [{ id: undefined, name: "Materials" }];
        if (!folderId) return path;

        let current = allFiles.find(f => f.id === folderId);
        const trail: { id: string | undefined, name: string }[] = [];
        while (current) {
            trail.unshift({ id: current.id, name: current.name });
            current = allFiles.find(f => f.id === current!.parentId);
        }
        return [...path, ...trail];
    }, []);
    
    const [currentPath, setCurrentPath] = useState(buildBreadcrumbPath());

    const navigateToFolder = (folderId?: string) => {
        setCurrentFolderId(folderId);
        setCurrentPath(buildBreadcrumbPath(folderId));
    };

    const filesToDisplay = allFiles.filter(file => file.parentId === currentFolderId);
    
    const filteredFiles = filesToDisplay.filter((file) =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const files = Array.from(e.dataTransfer.files);
        files.forEach((file, index) => {
            const uploadId = `upload-${Date.now()}-${index}`;
            const newUpload: UploadProgress = {
                id: uploadId,
                name: file.name,
                progress: 0,
                status: "uploading",
            };

            setUploadProgress((prev) => [...prev, newUpload]);

            // Simulate upload progress
            const interval = setInterval(() => {
                setUploadProgress((prev) =>
                    prev.map((upload) => {
                        if (upload.id === uploadId) {
                            const newProgress = Math.min(upload.progress + Math.random() * 30, 100);
                            return {
                                ...upload,
                                progress: newProgress,
                                status: newProgress === 100 ? "completed" : "uploading",
                            };
                        }
                        return upload;
                    }),
                );
            }, 500);

            setTimeout(() => {
                clearInterval(interval);
                setUploadProgress((prev) => prev.filter((upload) => upload.id !== uploadId));
            }, 3000);
        });
    }, []);

    const handleFileSelect = (fileId: string) => {
        setSelectedFiles((prev) => (prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]));
    };

    const handleFileUpload = () => {
        fileInputRef.current?.click();
    };

    const handleCreateFolder = () => {
        if (newFolderName.trim()) {
            // Add folder creation logic here
            setNewFolderName("");
            setShowCreateFolder(false);
        }
    };

    const toggleFolder = (folderId: string) => {
        setExpandedFolders((prev) => (prev.includes(folderId) ? prev.filter((id) => id !== folderId) : [...prev, folderId]));
    };

    const buildTreeStructure = (items: FileItem[]): (FileItem & { children: any[] })[] => {
        const itemMap = new Map<string, FileItem & { children: any[] }>();
        const rootItems: (FileItem & { children: any[] })[] = [];

        items.forEach((item) => {
            itemMap.set(item.id, { ...item, children: [] });
        });

        items.forEach((item) => {
            if (item.parentId) {
                const parent = itemMap.get(item.parentId);
                if (parent) {
                    parent.children.push(itemMap.get(item.id)!);
                }
            } else {
                rootItems.push(itemMap.get(item.id)!);
            }
        });

        return rootItems;
    };

    return {
        viewMode,
        setViewMode,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        selectedFiles,
        handleFileSelect,
        currentPath,
        navigateToFolder,
        isDragOver,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        uploadProgress,
        showCreateFolder,
        setShowCreateFolder,
        newFolderName,
        setNewFolderName,
        handleCreateFolder,
        handleFileUpload,
        fileInputRef,
        filteredFiles,
        expandedFolders,
        toggleFolder,
        buildTreeStructure,
        treeData: allFiles,
    }
} 