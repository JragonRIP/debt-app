"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, DollarSign, Gauge, List } from "lucide-react";

const links = [
  { href: "/", label: "Dashboard", icon: Gauge },
  { href: "/pay", label: "Pay", icon: DollarSign },
  { href: "/calculator", label: "Split", icon: Calculator },
  { href: "/history", label: "History", icon: List },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-chrome/20 bg-navy-900/95 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-md"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 pt-2 sm:max-w-xl">
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex min-w-[4.5rem] flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs font-medium transition ${
                active
                  ? "text-chrome-bright"
                  : "text-chrome/55 hover:text-chrome/80"
              }`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
                  active
                    ? "border-chrome/45 bg-chrome/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                    : "border-transparent"
                }`}
              >
                <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={active ? 2.25 : 1.75} />
              </span>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
