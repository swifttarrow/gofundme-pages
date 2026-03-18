import Image from "next/image";

interface MeerkatMascotProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<MeerkatMascotProps["size"]>, string> = {
  sm: "h-7 w-7",
  md: "h-10 w-10",
  lg: "h-14 w-14",
};

export function MeerkatMascot({ size = "md", className = "" }: MeerkatMascotProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${SIZE_CLASSES[size]} ${className}`}
      aria-hidden="true"
    >
      <Image
        src="/mascot/mOS38-transparent.png"
        alt=""
        fill
        sizes="56px"
        className="object-contain"
      />
    </div>
  );
}
