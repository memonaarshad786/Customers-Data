"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Search } from "lucide-react";

export function Header() {
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-md bg-green-600 flex items-center justify-center text-white font-bold">
              C
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-semibold text-gray-800">
                Customer Management
              </div>
              <div className="text-xs text-gray-500">
                Manage customers with ease
              </div>
            </div>
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          {/* placeholder for top-level navigation in future */}
          <nav className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
            <Link href="/customers" className="hover:underline">
              Customers
            </Link>
            <Link href="/customers/new" className="hover:underline">
              New
            </Link>
          </nav>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
