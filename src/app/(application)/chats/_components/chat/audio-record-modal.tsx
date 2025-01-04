"use client";

import { useState, useRef } from "react";

import { Mic } from "lucide-react";
import { useQueryState } from "nuqs";
import { useServerAction } from "zsa-react";

import { sendChatMessage } from "../../_actions/send-chat-message";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import { useToast } from "@/hooks/use-toast";

export function AudioRecordModal() {
  const [chatId, _setChatId] = useQueryState("chatId");

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const { toast } = useToast();

  const { execute: executeSendChatMessage } = useServerAction(sendChatMessage, {
    onError: () => {
      toast({
        title: "Erro ao enviar mensagem",
        description:
          "Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente.",
        variant: "destructive",
      });
    },
  });

  const startRecording = async () => {
    try {
      setAudioBlob(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
        const blob = event.data;
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
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
      // Parar o stream de mídia e liberar o microfone
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    }
  };

  const cancelRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setIsRecording(false);
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
  };

  const handleSend = async () => {
    if (audioBlob && chatId) {
      try {
        const file = new File([audioBlob], "audio.wav", {
          type: "audio/wav",
        });

        const formData = new FormData();
        formData.append("file", file);

        const result = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload`,
          {
            method: "POST",
            body: formData,
          },
        );

        if (!result.ok) {
          throw new Error("Failed to upload file");
        }

        const { url } = await result.json();

        await executeSendChatMessage({
          content: `${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`,
          type: "audio",
          chatId,
        });

        console.log("Sending audio file:", file);
      } catch (error) {
        console.error("Error converting and sending audio:", error);
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <Mic className="h-4 w-4" />
        </Button>
      </DialogTrigger>
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
          {isRecording && <p>Recording...</p>}
          {audioBlob && audioUrl && (
            <div className="flex flex-col gap-2">
              <Separator />
              <audio controls src={audioUrl} />
              <Separator />
            </div>
          )}
          {audioBlob && (
            <div className="flex items-center justify-end gap-2">
              <Button variant="destructive" onClick={cancelRecording}>
                Cancel Recording
              </Button>
              <Button onClick={handleSend}>Send Audio</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
