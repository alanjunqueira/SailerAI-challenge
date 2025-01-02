import Image from "next/image";

export default async function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-1">
      <h1 className="text-3xl">
        <strong>404 |</strong> Página não encontrada
      </h1>
    </div>
  );
}
