"use client";

import Image from "next/image";

import { useState } from "react";

import { LucideImage } from "lucide-react";
import { useQueryState } from "nuqs";
import { useServerAction } from "zsa-react";

import { sendChatMessage } from "../../_actions/send-chat-message";

import { FileInput } from "@/components/file-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { useFileInput } from "@/hooks/use-file-input";
import { useToast } from "@/hooks/use-toast";

export function ImageUploadModal() {
  const { toast } = useToast();
  const { files, imagePreview, setFiles, setImagePreview, handleRemoveFile } =
    useFileInput();

  const [chatId, _setChatId] = useQueryState("chatId");

  const { execute: executeSendChatMessage } = useServerAction(sendChatMessage, {
    onError: () => {
      toast({
        title: "Erro ao enviar mensagem",
        description:
          "Ocorreu um erro ao envia ra mensagem. Por favor, tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleUpload = async () => {
    if (files[0]) {
      try {
        const formData = new FormData();
        formData.append("file", files[0]);

        const result = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload`,
          {
            method: "POST",
            body: formData,
          },
        );

        if (!result.ok) {
          throw new Error("Failed to upload image");
        }

        const { url } = await result.json();

        if (chatId) {
          await executeSendChatMessage({
            content: `${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`,
            type: "image",
            chatId,
          });
        }

        setImagePreview(null);
      } catch (error) {
        console.error("Erro ao enviar imagem:", error);
        toast({
          title: "Erro ao enviar imagem",
          description:
            "Ocorreu um erro ao enviar a imagem. Por favor, tente novamente.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <LucideImage className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col">
          <h5 className="text-sm text-muted-foreground">
            Tamanho: 1920px x 1080px 16:9 700kb
          </h5>
          <h5 className="text-sm text-muted-foreground">
            Arquivo: JPG, JPEG ou PNG
          </h5>

          <div className="mt-7">
            {!!imagePreview && (
              <div className="aspect-h-3 aspect-w-7 mb-4 max-w-sm">
                <Image
                  alt=""
                  src={imagePreview}
                  width={1440}
                  height={600}
                  className="object-cover"
                />
              </div>
            )}

            <FileInput
              files={files}
              setFiles={setFiles}
              setImagePreview={setImagePreview}
              removeFile={handleRemoveFile}
              mimeTypes={["png", "jpg", "jpeg"]}
              maxSize={700 * 1024} // 700kb
            />
          </div>

          <Button className="mt-4 self-end" onClick={handleUpload} disabled={!files[0]}>
            Send Image
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
