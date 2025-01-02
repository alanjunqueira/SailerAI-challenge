"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type ImageUploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ImageUploadModal({ isOpen, onClose }: ImageUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      // Aqui você implementaria a lógica para enviar a imagem
      console.log("Uploading file:", selectedFile.name);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input type="file" accept="image/*" onChange={handleFileChange} />
          <Button onClick={handleUpload} disabled={!selectedFile}>
            Upload
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
