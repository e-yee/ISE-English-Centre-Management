import React, { useState } from "react";
import { ChevronDown, ChevronUp, X, FileImage, FileVideo, FileAudio, FileCode, File as FileIconLucide, XCircle } from "lucide-react";
import type { UploadItem } from "@/hooks/useUpload";

const CheckCircle = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 256 256">
        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"></path>
    </svg>
);

const FILE_TYPES = {
  pdf: { icon: FileIconLucide, color: "text-red-500" },
  zip: { icon: FileIconLucide, color: "text-gray-500 dark:text-gray-400" },
  jpg: { icon: FileImage, color: "text-yellow-500" },
  jpeg: { icon: FileImage, color: "text-yellow-500" },
  png: { icon: FileImage, color: "text-yellow-500" },
  doc: { icon: FileIconLucide, color: "text-blue-500" },
  docx: { icon: FileIconLucide, color: "text-blue-500" },
  xls: { icon: FileIconLucide, color: "text-green-500" },
  xlsx: { icon: FileIconLucide, color: "text-green-500" },
  ppt: { icon: FileIconLucide, color: "text-orange-500" },
  pptx: { icon: FileIconLucide, color: "text-orange-500" },
  mp4: { icon: FileVideo, color: "text-purple-500" },
  mp3: { icon: FileAudio, color: "text-pink-500" },
  js: { icon: FileCode, color: "text-indigo-500" },
} as const;


const CircleProgress = ({ progress }: { progress: number }) => {
    const normalizedProgress = Math.min(Math.max(0, progress), 100);
    const circumference = 2 * Math.PI * 10;
    const offset = circumference - (normalizedProgress / 100) * circumference;

    return (
        <div className="relative h-5 w-5">
            <svg className="h-5 w-5 -rotate-90" viewBox="0 0 24 24">
                <circle className="stroke-gray-200 dark:stroke-gray-600" strokeWidth="3" fill="none" r="10" cx="12" cy="12" />
                <circle
                    className="stroke-blue-600 dark:stroke-blue-400 transition-all duration-300"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                    r="10"
                    cx="12"
                    cy="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                />
            </svg>
        </div>
    );
};

const FileIcon = ({ fileType, className = "" }: { fileType: string; className?: string; }) => {
    const config = FILE_TYPES[fileType.toLowerCase() as keyof typeof FILE_TYPES];
    const IconComponent = config?.icon || FileIconLucide;
    const colorClass = config?.color || "text-gray-400 dark:text-gray-500";
    return <IconComponent size={20} className={`${colorClass} ${className}`} />;
};

const StatusIcon = ({ status }: { status: UploadItem["status"] }) => {
    if (status === "SUCCESS") return <CheckCircle />;
    if (status === "ERROR") return <XCircle size={20} className="text-red-500 dark:text-red-400" />;
    return null;
};

const UploadItemRow = ({ item, onRemove }: { item: UploadItem; onRemove: (id: string) => void; }) => (
    <div className="flex max-w-[280px] items-center justify-between py-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
            <FileIcon fileType={item.fileType} className={item.status === "UPLOADING" ? "opacity-50 p-0.5 pl-0" : "p-0.5 pl-0"} />
            <span className="truncate capitalize text-sm text-gray-700 dark:text-gray-300 cursor-default" title={item.fileName}>
                {item.fileName}
            </span>
        </div>
        <div className="flex items-center gap-1 ml-2">
            {item.status === "UPLOADING" ? (
                <div className="relative group">
                    <CircleProgress progress={item.progress} />
                    <button onClick={() => onRemove(item.id)} className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                        <X className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                    </button>
                </div>
            ) : (
                <>
                    <StatusIcon status={item.status} />
                    <button onClick={() => onRemove(item.id)} className="flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-gray-600 dark:hover:text-gray-200 size-5 rounded-full cursor-pointer transition-colors">
                        <X className="h-3 w-3" />
                    </button>
                </>
            )}
        </div>
    </div>
);

const DriveUploadToast = ({ items, onRemoveItem, onClearAll, className = "fixed bottom-0 right-4 z-50 w-[320px]", }: { items: UploadItem[]; onRemoveItem: (id: string) => void; onClearAll: () => void; className?: string; }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const uploadingCount = items.filter((item) => item.status === "UPLOADING").length;

    if (items.length === 0) return null;

    return (
        <div className={className}>
            <div className="bg-white dark:bg-gray-800 rounded-[20px] rounded-b-none shadow-lg border border-blue-300 dark:border-blue-600">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-md font-semibold text-gray-900 dark:text-gray-100">
                        {uploadingCount > 0 ? `Uploading ${uploadingCount} item${uploadingCount > 1 ? "s" : ""}` : "Upload complete"}
                    </span>
                    <div className="flex items-center gap-1">
                        <button onClick={() => setIsExpanded(!isExpanded)} className="p-1 rounded transition-colors hover:bg-gray-100 dark:hover:bg-gray-700" title={isExpanded ? "Collapse" : "Expand"}>
                            {isExpanded ? (<ChevronDown strokeWidth={2} className="h-4 w-4 text-gray-800 dark:text-gray-200" />) : (<ChevronUp strokeWidth={2} className="h-4 w-4 text-gray-800 dark:text-gray-200" />)}
                        </button>
                        <button onClick={onClearAll} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors" title="Clear all">
                            <X className="h-4 w-4 text-gray-800 dark:text-gray-200" />
                        </button>
                    </div>
                </div>
                {isExpanded && (
                    <div className="max-h-64 overflow-y-auto">
                        {items.map((item) => (
                            <div key={item.id} className="group px-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <UploadItemRow item={item} onRemove={onRemoveItem} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DriveUploadToast; 