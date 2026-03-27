import Image from "next/image";

export default function Loading() {
  return (
    <main className="grid min-h-dvh place-items-center bg-white text-zinc-900">
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/asrofinexq-logo.png"
          alt="Loading"
          width={80}
          height={80}
          priority
          className="animate-pulse object-contain"
        />

        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-900 [animation-delay:-0.2s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-900 [animation-delay:-0.1s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-900" />
          <span className="sr-only">Loading</span>
        </div>
      </div>
    </main>
  );
}
