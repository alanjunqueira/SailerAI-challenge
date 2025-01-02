"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-full flex-col items-center min-h-screen">
      <div className="flex h-full flex-1 flex-col items-center justify-center">
        <h2 className="text-3xl">Ocorreu um erro</h2>
        <div className="flex items-center gap-2">
          <span className="font-bold text-foreground">{error.name}</span>
          <span className="font-medium text-muted-foreground">
            {error.message}
          </span>
        </div>
        <Button onClick={() => reset()} className="mt-4">
          Tentar novamente
        </Button>
      </div>
    </div>
  );
}
