"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MeerkatMascot } from "@/components/meerkat-mascot";
import { SEED_NOTIFICATIONS, timeAgo } from "@/lib/seed-data";

const NAV_DROPDOWN_LIMIT = 4;

export function Navbar() {
  const [searchValue, setSearchValue] = useState("");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const unreadCount = SEED_NOTIFICATIONS.filter((notification) => !notification.isRead).length;
  const recentNotifications = SEED_NOTIFICATIONS.slice(0, NAV_DROPDOWN_LIMIT);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!notificationsRef.current?.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border-light">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 flex-shrink-0">
          <MeerkatMascot size="sm" className="h-8 w-8" />
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
          <div className="relative" ref={notificationsRef}>
            <div className="flex items-center">
              <Link
                href="/notifications"
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-border-light text-text-secondary hover:text-text-primary hover:bg-bg-faint transition-colors"
                aria-label="Open notifications page"
                onClick={() => setIsNotificationsOpen(false)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16v12H5.17L4 17.17V4z" />
                  <path d="m4 6 8 6 8-6" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-primary text-white text-[10px] font-semibold leading-4 text-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>
              <button
                type="button"
                className="inline-flex h-9 w-7 items-center justify-center text-text-secondary hover:text-text-primary"
                aria-label={isNotificationsOpen ? "Close notification preview" : "Open notification preview"}
                aria-expanded={isNotificationsOpen}
                onClick={() => setIsNotificationsOpen((open) => !open)}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`transition-transform ${isNotificationsOpen ? "rotate-180" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-lg border border-border-light bg-white shadow-lg p-2 z-50">
                <div className="flex items-center justify-between px-2 py-1.5">
                  <p className="text-sm font-semibold text-text-primary">Notifications</p>
                  <Link
                    href="/notifications"
                    className="text-xs text-primary font-medium hover:underline"
                    onClick={() => setIsNotificationsOpen(false)}
                  >
                    View all
                  </Link>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {recentNotifications.map((notification) => (
                    <Link
                      key={notification.id}
                      href={notification.deepLink}
                      className={`block rounded-md px-2 py-2 hover:bg-bg-faint transition-colors ${
                        notification.isRead ? "" : "bg-primary-light"
                      }`}
                      onClick={() => setIsNotificationsOpen(false)}
                    >
                      <p className="text-sm font-medium text-text-primary line-clamp-1">
                        {notification.title}
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">
                        {notification.body}
                      </p>
                      <p className="text-[11px] text-text-muted mt-1">
                        {timeAgo(notification.createdAt)}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Link
            href="/sign-in"
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
