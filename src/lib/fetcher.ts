"use server";

export const fetcher = async (
  url: string,
  { headers, body, method, cache, ...options }: RequestInit = {},
) => {
  const defaultHeaders: HeadersInit = {
    ...(body && { "Content-Type": "application/json" }),
  };

  return fetch(url, {
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    ...(body && {
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
    method: method || "GET",
    cache: cache || "no-store",
    ...options,
  });
};
