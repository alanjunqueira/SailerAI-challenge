export const convertBlobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        resolve(reader.result.toString());
      } else {
        reject(new Error("Error converting Blob to Base64"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
