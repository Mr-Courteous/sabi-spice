import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
}

export default function Logo({ variant = "dark", size = "md" }: LogoProps) {
  const dims = { sm: 34, md: 44, lg: 62 };
  const text = { sm: "text-xl", md: "text-2xl", lg: "text-4xl" };
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <div className="relative flex-shrink-0 rounded-full overflow-hidden bg-white shadow-sm ring-2 ring-sabi-black/10" style={{ width: dims[size], height: dims[size] }}>
        <Image src="/sabi-logo.png" alt="Sabi Spice" fill className="object-cover" />
      </div>
      <div className="hidden min-[340px]:flex items-baseline gap-1.5 leading-none">
        <span className={`font-serif font-extrabold ${text[size]} ${variant === "light" ? "text-white" : "text-sabi-leaf group-hover:text-sabi-emerald transition-colors"}`}>Sabi</span>
        <span className={`font-script ${text[size]} text-saffron group-hover:text-saffron-dark transition-colors drop-shadow-sm`}>Spice</span>
      </div>
    </Link>
  );
}
