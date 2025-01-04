// {"filename":"20250104212852_2b0c5569.jpg","url":"/files/20250104212852_2b0c5569.jpg"}"use server";

import { authedProcedure } from "@/app/_shared/procedures/authedProcedure";
import { Env } from "@/helpers/env/env";

import {
  uploadFileSchema,
  uploadFileOutputSchema,
} from "../../validators/file/upload-file.validator";

import { fetcher } from "@/lib/fetcher";

export const uploadFile = authedProcedure
  .createServerAction()
  .input(uploadFileSchema)
  .output(uploadFileOutputSchema)
  .onInputParseError(async (error) => {
    return error.flatten().fieldErrors;
  })
  .handler(async ({ input: { file } }) => {
    const formData = new FormData();
    formData.append("file", file);

    const result = await fetcher(`${Env.API_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!result.ok) {
      throw new Error("Failed to upload file");
    }

    return await result.json();
  });
