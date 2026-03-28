import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="flex h-14 w-full items-center justify-between border-b border-[#2A2A2A] bg-[#0A0A0A] px-8">
      <Link href="/" className="flex items-center gap-2 cursor-pointer">
        <span className="font-mono text-xl font-bold text-emerald-500">
          &gt;
        </span>
        <span className="font-mono text-lg font-medium text-zinc-50">
          devroast
        </span>
      </Link>
      <div className="flex items-center gap-6">
        <Link
          href="/leaderboard"
          className="font-mono text-sm text-zinc-400 hover:text-emerald-500"
        >
          leaderboard
        </Link>
      </div>
    </nav>
  );
}
