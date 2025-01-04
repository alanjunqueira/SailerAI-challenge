import { z } from "zod";

export const uploadFileSchema = z.object({
  file: z.instanceof(File),
});

export const uploadFileOutputSchema = z.object({
  filename: z.string(),
  url: z.string(),
});

export type TUploadFileOutput = z.output<typeof uploadFileOutputSchema>;
