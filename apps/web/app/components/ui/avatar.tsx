import { cn } from "../../lib/utils";

const COLORS = [
  "bg-primary",
  "bg-zinc-800",
  "bg-zinc-900",
  "bg-[#4a0012]",
  "bg-[#2d000b]",
];

function hashColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % COLORS.length;
  return COLORS[h] ?? COLORS[0]!;
}

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = { sm: "w-8 h-8 text-[10px]", md: "w-10 h-10 text-xs", lg: "w-14 h-14 text-sm" };

export function Avatar({ name, size = "md", className }: AvatarProps) {
  return (
    <div
      className={cn(
        "rounded-xl shrink-0 flex items-center justify-center text-white font-black uppercase tracking-tighter shadow-inner",
        sizes[size],
        hashColor(name),
        className
      )}
      style={{
        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.1), 0 4px 6px -1px rgba(0,0,0,0.2)",
      }}
    >
      {name.slice(0, 2)}
    </div>
  );
}

