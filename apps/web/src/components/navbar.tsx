"use client";

import Link from "next/link";
import { useState } from "react";

export function Navbar() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border-light">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2C5.79 2 4 3.79 4 6c0 3 4 8 4 8s4-5 4-8c0-2.21-1.79-4-4-4zm0 5.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="white"/>
            </svg>
          </div>
          <span className="font-bold text-text-primary text-base hidden sm:block">
            GoSupportMe
          </span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search fundraisers..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-bg-gray border border-border-light rounded-md
                         focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20
                         text-text-primary placeholder:text-text-muted"
            />
          </div>
        </div>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-4 ml-auto">
          <Link
            href="/community"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="/charity/new"
            className="bg-primary text-white text-sm font-semibold px-4 py-2 rounded-md
                       hover:bg-primary-dark transition-colors whitespace-nowrap"
          >
            Start a GoSupportMe
          </Link>
          <Link
            href="/notifications"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Sign in
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden ml-auto p-2 text-text-secondary hover:text-text-primary"
          aria-label="Menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
    </header>
  );
}
