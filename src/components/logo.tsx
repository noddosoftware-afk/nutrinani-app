import Image from "next/image";

export function Logo({ size = 32 }: { size?: number }) {
  return (
    <Image
      src="/brand/logo.png"
      alt="NutriNani"
      width={size}
      height={size}
      className="rounded-lg"
      priority
    />
  );
}
