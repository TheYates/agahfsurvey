"use client";

import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Header() {
  return (
    <header className="w-full py-3 px-4 border-b border-border">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/agahflogo svg.svg"
              alt="AGA Health Foundation"
              width={40}
              height={40}
              className="dark:invert"
            />
            <span className="font-medium text-lg hidden sm:inline-block">
              AGA Health Foundation
            </span>
          </Link>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
