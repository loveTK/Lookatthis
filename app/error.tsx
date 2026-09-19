"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-3xl font-bold tracking-tight">Something went wrong.</h1>
      <button onClick={reset} className="btn-ghost mt-6">Try again</button>
    </div>
  );
}
