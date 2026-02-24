"use client";

import { Settings } from "lucide-react";

export function ThemeToggle() {
  return (
    <button
      aria-label="Settings"
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
      title="Settings"
    >
      <Settings className="h-4 w-4" />
    </button>
  );
}
