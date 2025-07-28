import { useState, useCallback, useRef } from 'react';

export interface UploadItem {
  id: string;
  fileName: string;
  fileType: string;
  status: "UPLOADING" | "SUCCESS" | "ERROR";
  progress: number;
  error?: string;
}

const UPLOAD_DURATION = { min: 5000, max: 10000 };

export const useUploadStore = () => {
  const [items, setItems] = useState<UploadItem[]>([]);

  const addItem = useCallback((fileName: string, fileType: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newItem: UploadItem = {
      id,
      fileName,
      fileType,
      status: "UPLOADING",
      progress: 0,
    };
    setItems((prev) => [...prev, newItem]);
    return id;
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<UploadItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearAll = useCallback(() => setItems([]), []);

  return { items, addItem, updateItem, removeItem, clearAll };
};

export const useUploadSimulation = (
  updateItem: (id: string, updates: Partial<UploadItem>) => void
) => {
  const activeUploads = useRef<Set<string>>(new Set());

  return useCallback(
    (id: string) => {
      if (activeUploads.current.has(id)) return;

      activeUploads.current.add(id);
      let progress = 0;
      const duration =
        UPLOAD_DURATION.min +
        Math.random() * (UPLOAD_DURATION.max - UPLOAD_DURATION.min);
      const increment = (100 / duration) * 100;

      const interval = setInterval(() => {
        progress = Math.min(progress + increment + Math.random() * 2, 95);
        updateItem(id, { progress: Math.floor(progress) });

        if (progress >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            const isSuccess = Math.random() > 0.4;
            updateItem(id, {
              status: isSuccess ? "SUCCESS" : "ERROR",
              progress: 100,
              error: isSuccess ? undefined : "Upload failed. Please try again.",
            });
            activeUploads.current.delete(id);
          }, 500);
        }
      }, 100);
    },
    [updateItem]
  );
}; 