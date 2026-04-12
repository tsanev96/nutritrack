"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuthUser } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";

const SECTIONS = [
  {
    label: "Home",
    links: [
      { href: "/", label: "Home" },
      { href: "/goals", label: "Goals" },
      { href: "/measurements/check-in", label: "Check-in" },
    ],
  },
  {
    label: "Food",
    links: [
      { href: "/food/diary", label: "Food Diary" },
      { href: "/food/database", label: "Database" },
      { href: "/food/my-meals", label: "My Meals" },
      { href: "/food/recipes", label: "My Recipes" },
    ],
  },
];

export default function Nav() {
  const pathname = usePathname();
  const { user } = useAuthUser();

  const activeSection =
    SECTIONS.find((s) => s.links.some((l) => l.href === pathname)) ??
    SECTIONS[0];

  // Don't show nav on auth pages
  if (pathname.startsWith("/auth")) return null;

  return (
    <nav className="border-b border-outline bg-surface-card">
      {/* Top row: logo + section tabs + user */}
      <div className="mx-auto flex max-w-4xl items-center gap-6 px-6 py-3">
        <span className="font-semibold text-heading">Nutri Tracker</span>
        <div className="flex gap-1">
          {SECTIONS.map((section) => {
            const isActive = section.label === activeSection.label;
            return (
              <Link
                key={section.label}
                href={section.links[0].href}
                className={`cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sage/10 text-sage"
                    : "text-body hover:text-sage"
                }`}
              >
                {section.label}
              </Link>
            );
          })}
        </div>

        {/* User email + logout, pushed to the right */}
        {user && (
          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs text-caption">{user.email}</span>
            <Button
              onClick={() => supabase.auth.signOut()}
              variant="default"
              size="sm"
            >
              Sign out
            </Button>
          </div>
        )}
      </div>

      {/* Bottom row: sub-links for active section */}
      <div className="mx-auto flex max-w-4xl gap-4 px-6 pb-2">
        {activeSection.links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`text-sm transition-colors cursor-pointer ${
              pathname === href
                ? "border-b-2 border-sage pb-1 font-medium text-sage"
                : "pb-1 text-body hover:text-sage"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
