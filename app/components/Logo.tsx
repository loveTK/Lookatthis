export function Logo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <path d="M32 54s16-13.5 16-26a16 16 0 1 0-32 0c0 12.5 16 26 16 26z" fill="currentColor" />
      <ellipse cx="32" cy="28" rx="9" ry="6" fill="var(--color-bg)" />
      <circle cx="32" cy="28" r="3.2" fill="currentColor" />
    </svg>
  );
}
