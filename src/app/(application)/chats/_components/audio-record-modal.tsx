"use client";

import { useState, useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type AudioRecordModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AudioRecordModal({ isOpen, onClose }: AudioRecordModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
        setAudioBlob(event.data);
      });
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSend = () => {
    if (audioBlob) {
      // Aqui você implementaria a lógica para enviar o áudio
      console.log("Sending audio blob:", audioBlob);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Audio</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {isRecording ? (
            <Button onClick={stopRecording}>Stop Recording</Button>
          ) : (
            <Button onClick={startRecording}>Start Recording</Button>
          )}
          {audioBlob && <Button onClick={handleSend}>Send Audio</Button>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
