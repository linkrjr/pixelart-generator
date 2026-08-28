import { Generator } from "@/components/generator";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-full max-w-3xl flex-col items-center px-6 py-16 sm:py-24">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          PixelArt Generator
        </h1>
        <p className="mt-3 text-base text-muted">
          Describe an image and get pixel art back.
        </p>
      </header>
      <Generator />
    </main>
  );
}
