import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
}

export default function Logo({ variant = "dark", size = "md" }: LogoProps) {
  const dims = { sm: 32, md: 42, lg: 60 };
  const text = { sm: "text-xl", md: "text-2xl", lg: "text-4xl" };
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <div className="relative flex-shrink-0 rounded-full overflow-hidden bg-white" style={{ width: dims[size], height: dims[size] }}>
        <Image src="/sabi-logo.png" alt="Sabi Spice" fill className="object-cover" />
      </div>
      <div className="flex items-baseline gap-1.5 leading-none">
        <span className={`font-serif font-bold ${text[size]} ${variant === "light" ? "text-white" : "text-sabi-leaf"}`}>Sabi</span>
        <span className={`font-script ${text[size]} text-saffron`}>Spice</span>
      </div>
    </Link>
  );
}
