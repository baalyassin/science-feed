"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Bookmark, Home, LogOut, Search } from "lucide-react";

const TABS = [
  { href: "/feed", label: "Feed", icon: Home },
  { href: "/search", label: "Recherche", icon: Search },
  { href: "/saved", label: "Sauvegardés", icon: Bookmark },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-around border-t border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-black/90 backdrop-blur px-2 py-2 shrink-0">
      {TABS.map((tab) => {
        const active = pathname.startsWith(tab.href);
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center gap-1 text-xs px-3 py-1 ${
              active
                ? "text-indigo-600 dark:text-indigo-400 font-medium"
                : "text-neutral-400"
            }`}
          >
            <Icon className="w-5 h-5" strokeWidth={active ? 2 : 1.5} />
            {tab.label}
          </Link>
        );
      })}
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="flex flex-col items-center gap-1 text-xs px-3 py-1 text-neutral-400"
      >
        <LogOut className="w-5 h-5" strokeWidth={1.5} />
        Sortir
      </button>
    </nav>
  );
}
