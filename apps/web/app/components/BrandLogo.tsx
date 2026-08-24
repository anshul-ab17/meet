"use client";

/**
 * Meet emblem — chat / connection brand mark.
 */
export function BrandLogo({
  size = 40,
  className = "",
  title = "Meet — Connect, Chat, Collaborate",
}: {
  size?: number;
  className?: string;
  title?: string;
}) {
  return (
    <div
      title={title}
      className={`flex items-center justify-center rounded-xl bg-gradient-to-tr from-[#f0b46a] via-[#e59d4c] to-[#f8c988] text-black font-extrabold shadow-md ${className}`}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ width: `${Math.round(size * 0.58)}px`, height: `${Math.round(size * 0.58)}px` }}
      >
        <path d="M4.98 3.5C3.34 3.5 2 4.84 2 6.48v9.04C2 17.16 3.34 18.5 4.98 18.5h2.52v2.75a.75.75 0 0 0 1.28.53L12.53 18.5h6.49c1.64 0 2.98-1.34 2.98-2.98V6.48c0-1.64-1.34-2.98-2.98-2.98H4.98Zm5.52 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm4.5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm4.5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
      </svg>
    </div>
  );
}

