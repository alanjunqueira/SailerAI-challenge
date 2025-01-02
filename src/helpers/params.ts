export const buildParams = (params?: {
  [key: string]: string | string[] | undefined;
}) => {
  if (!params) return "";

  const urlParams = new URLSearchParams();

  for (const key in params) {
    if (Array.isArray(params[key])) {
      (params[key] as Array<string>).forEach((v) => urlParams.append(key, v));
    } else {
      urlParams.append(key, params[key] as string);
    }
  }

  return urlParams.toString();
};
