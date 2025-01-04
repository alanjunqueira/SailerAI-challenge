import { useState } from "react";

export const useFileInput = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleResetFiles = () => {
    setImagePreview(null);
    setFiles([]);
  };

  const handleRemoveFile = (name: string) => {
    if (files && files.length) {
      const filteredFiles = files.filter((file) => {
        return file.name !== name;
      });
      setFiles(filteredFiles);
      if(filteredFiles.length === 0) {
        setImagePreview(null);
      }
    }
  }

  const handleRemoveImagePreview = () => {
    setImagePreview(null);
  }

  return {
    files,
    setFiles,
    imagePreview,
    setImagePreview,
    handleResetFiles,
    handleRemoveFile,
    handleRemoveImagePreview
  };
};
