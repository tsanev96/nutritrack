"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/goals", label: "Goals" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-white px-6 py-3">
      <div className="mx-auto flex max-w-4xl items-center gap-6">
        <span className="font-semibold text-gray-900">CalTracker</span>
        <div className="flex gap-4">
          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium transition-colors ${
                pathname === href
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
