import { ComponentProps, useCallback } from "react";
import { DropEvent, FileRejection, useDropzone } from "react-dropzone";

import { CloudUpload, FileImage, Trash } from "lucide-react";

import { Button } from "./ui/button";

import { cn } from "@/lib/utils";

import { useToast } from "@/hooks/use-toast";

type TPossibleMimeTypes =
  | "png"
  | "jpeg"
  | "jpg"
  | "svg"
  | "webp"
  | "mp3"
  | "wav"
  | "ogg"
  | "m4a";

interface IFileInputProps extends ComponentProps<"div"> {
  files: File[] | null;
  setFiles: (files: File[]) => void;
  setImagePreview: (imagePreview: string | null) => void;
  removeFile: (name: string) => void;
  maxFiles?: number;
  maxSize?: number;
  minSize?: number;
  mimeTypes: TPossibleMimeTypes[];
  inputText?: string;
}

export const FileInput = ({
  files,
  removeFile,
  setFiles,
  setImagePreview,
  maxFiles,
  maxSize,
  minSize,
  mimeTypes,
  inputText,
  className,
  ...props
}: IFileInputProps) => {
  const { toast } = useToast();

  const handleDrop = useCallback(
    (files: File[]) => {
      console.log('aqui');
      if (!files.length) return;

      setFiles(files);

      const file = files[0];
      if (file) {
        const imageTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];

        if (imageTypes.includes(file.type)) {
          const reader = new FileReader();
          reader.onload = () => {
            setImagePreview(reader.result as string);
          };
          reader.onerror = () => {
            toast({
              variant: "destructive",
              title: "File read error",
              description: "There was an error reading the file.",
            });
          };
          reader.readAsDataURL(file);
        }
      }
    },
    [setFiles, setImagePreview, toast],
  );

  const handleDropRejected = useCallback(
    (files: FileRejection[], _event: DropEvent) => {
      const { code } = files[0].errors[0];

      switch (code) {
        case "file-invalid-type":
          toast({
            variant: "destructive",
            title: "File invalid type",
            description: `File invalid type, allowed type are ${mimeTypes.reduce(
              (acc, curr, index, arr) => {
                if (index === 0) return curr;
                if (index === arr.length - 1) return `${acc} e ${curr}.`;
                return `${acc}, ${curr}`;
              },
              "",
            )}`,
          });
          break;
        case "file-too-large":
          toast({
            variant: "destructive",
            title: "File too large",
            description: `File too large, allowed max size is ${maxSize} bytes`,
          });
          break;
        case "file-too-small":
          toast({
            variant: "destructive",
            title: "File too small",
            description: `File too small, allowed min size is ${minSize} bytes`,
          });
          break;
        case "too-many-files":
          toast({
            variant: "destructive",
            title: "Too many files",
            description: `You can add at most ${maxFiles ?? 1} ${
              !!maxFiles && maxFiles > 1 ? "files" : "file"
            }`,
          });
          break;
      }

      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while trying to upload the file",
      });
    },
    [maxFiles, maxSize, minSize, mimeTypes, toast],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: maxFiles ?? 1,
    ...(!!maxSize && { maxSize }),
    ...(!!minSize && { minSize }),
    onDrop: handleDrop,
    onDropRejected: handleDropRejected,
    accept: {
      ...(mimeTypes?.includes("png") && { "image/png": [".png"] }),
      ...((mimeTypes?.includes("jpeg") || mimeTypes?.includes("jpg")) && {
        "image/jpeg": [".jpeg", ".jpg"],
      }),
      ...(mimeTypes?.includes("svg") && { "image/svg+xml": [".svg"] }),
      ...(mimeTypes?.includes("webp") && { "image/webp": [".webp"] }),
      ...(mimeTypes?.includes("mp3") && { "audio/mp3": [".mp3"] }),
      ...(mimeTypes?.includes("wav") && { "audio/wav": [".wav"] }),
      ...(mimeTypes?.includes("ogg") && { "audio/ogg": [".ogg"] }),
      ...(mimeTypes?.includes("m4a") && { "audio/m4a": [".m4a"] }),
    },
  });

  return (
    <div
      {...props}
      {...getRootProps()}
      className={cn(
        "flex size-full rounded-lg border-4 border-dashed border-border",
        {
          "w-full h-fit cursor-pointer flex-col gap-2 bg-background p-4 hover:bg-primary/20":
            files?.length,
          "cursor-default border-primary bg-background/90":
            files?.length && isDragActive,
          "bg-background/80 transition-all duration-200 ease-in hover:border-primary hover:bg-background":
            !files?.length,
        },
        className,
      )}
    >
      {files?.length ? (
        files.map((file, i) => (
          <div
            key={i}
            className="flex cursor-default items-center justify-between gap-4 rounded-md bg-primary/40 px-4 py-2.5"
          >
            <FileImage className="size-6" />
            <p className="line-clamp-1 max-w-56">{file.name}</p>
            <Button
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                removeFile(file.name);
              }}
              type="button"
            >
              <Trash className="size-6" />
            </Button>
          </div>
        ))
      ) : (
        <>
          <label className="size-full cursor-pointer" htmlFor="dropzone-file">
            {inputText ? (
              <div>
                <CloudUpload
                  className={cn("size-6", {
                    "text-foreground/80": !isDragActive,
                    "text-foreground": isDragActive,
                  })}
                />
                <p className="text-xs font-normal text-foreground">
                  {inputText}
                </p>
              </div>
            ) : (
              <div className="flex size-full flex-col items-center justify-center pb-6 pt-5">
                <CloudUpload
                  className={cn("size-8", {
                    "text-foreground/80": !isDragActive,
                    "text-foreground": isDragActive,
                  })}
                />
                {isDragActive ? (
                  <p className="px-2 text-center text-lg font-bold text-foreground">
                    Drop to upload file
                  </p>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-1">
                    <p className="px-2 text-center text-lg text-foreground">
                      Press or drag file here to upload
                    </p>
                    <p className="text-center text-xs text-foreground">
                      {mimeTypes.reduce((acc, curr, index, arr) => {
                        if (index === 0) return curr;
                        if (index === arr.length - 1)
                          return `${acc} e ${curr}.`;
                        return `${acc}, ${curr}`;
                      }, "")}
                    </p>
                  </div>
                )}
              </div>
            )}
          </label>
          <input {...getInputProps()} className="hidden" />
        </>
      )}
    </div>
  );
};
