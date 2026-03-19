"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MeerkatMascot } from "@/components/meerkat-mascot";
import { AuthUser, getCurrentUser, logout } from "@/lib/api";
import { SEED_FAVORITES, SEED_FUNDRAISERS, SEED_NOTIFICATIONS, formatCents, timeAgo } from "@/lib/seed-data";

const NAV_DROPDOWN_LIMIT = 4;
const FAVORITES_PREVIEW_LIMIT = 3;
const CURRENT_USER_ID = "a1b2c3d4-0002-0002-0002-000000000002";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const favoritesRef = useRef<HTMLDivElement>(null);
  const createMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = SEED_NOTIFICATIONS.filter((notification) => !notification.isRead).length;
  const recentNotifications = SEED_NOTIFICATIONS.slice(0, NAV_DROPDOWN_LIMIT);
  const favoriteFundraisers = SEED_FAVORITES
    .filter((favorite) => favorite.userId === CURRENT_USER_ID)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((favorite) => SEED_FUNDRAISERS.find((fundraiser) => fundraiser.id === favorite.fundraiserId))
    .filter((fundraiser): fundraiser is NonNullable<typeof fundraiser> => fundraiser !== undefined)
    .slice(0, FAVORITES_PREVIEW_LIMIT);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!notificationsRef.current?.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (!favoritesRef.current?.contains(event.target as Node)) {
        setIsFavoritesOpen(false);
      }
      if (!createMenuRef.current?.contains(event.target as Node)) {
        setIsCreateMenuOpen(false);
      }
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let isMounted = true;

    getCurrentUser()
      .then((response) => {
        if (isMounted) {
          setCurrentUser(response.user);
        }
      })
      .catch(() => {
        if (isMounted) {
          setCurrentUser(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  async function handleLogout() {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
      setCurrentUser(null);
      router.push("/sign-in");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  }

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
            href="/"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Discover
          </Link>
          <Link
            href="/community"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Communities
          </Link>
          <div className="relative" ref={createMenuRef}>
            <button
              type="button"
              className="border border-border-medium bg-white text-text-primary text-sm font-semibold px-4 py-2 rounded-md
                         hover:border-primary hover:text-primary hover:bg-bg-faint transition-colors whitespace-nowrap inline-flex items-center gap-1.5"
              aria-label={isCreateMenuOpen ? "Close create menu" : "Open create menu"}
              aria-expanded={isCreateMenuOpen}
              onClick={() => setIsCreateMenuOpen((open) => !open)}
            >
              Create +
            </button>
            {isCreateMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-lg border border-border-light bg-white shadow-lg p-1.5 z-50">
                <Link
                  href="/fundraiser/new?source=primary_cta"
                  className="block rounded-md px-3 py-2 text-sm text-text-primary hover:bg-bg-faint transition-colors"
                  onClick={() => setIsCreateMenuOpen(false)}
                >
                  Create fundraiser
                </Link>
                <Link
                  href="/charity/new?source=primary_cta"
                  className="block rounded-md px-3 py-2 text-sm text-text-primary hover:bg-bg-faint transition-colors"
                  onClick={() => setIsCreateMenuOpen(false)}
                >
                  Create charity
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center gap-0.5">
            <div className="relative" ref={favoritesRef}>
              <button
                type="button"
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-faint transition-colors"
                aria-label={isFavoritesOpen ? "Close favorites preview" : "Open favorites preview"}
                aria-expanded={isFavoritesOpen}
                onClick={() => setIsFavoritesOpen((open) => !open)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>

              {isFavoritesOpen && (
                <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-xl border border-primary/20 bg-white shadow-[0_12px_30px_rgba(0,185,100,0.12)] p-2 z-50">
                  <div className="flex items-center justify-between rounded-lg px-2.5 py-2">
                    <p className="text-sm font-semibold text-text-primary">Favorites</p>
                    <Link
                      href="/favorites"
                      className="text-xs text-primary font-medium hover:underline"
                      onClick={() => setIsFavoritesOpen(false)}
                    >
                      View All
                    </Link>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {favoriteFundraisers.map((fundraiser) => (
                      <Link
                        key={fundraiser.id}
                        href={`/fundraiser/${fundraiser.id}`}
                        className="block rounded-md px-2 py-2 hover:bg-primary/5 transition-colors"
                        onClick={() => setIsFavoritesOpen(false)}
                      >
                        <p className="text-sm font-medium text-text-primary line-clamp-1">
                          {fundraiser.title}
                        </p>
                        <p className="text-xs text-text-secondary mt-0.5">
                          {formatCents(fundraiser.raisedCents)} raised
                        </p>
                      </Link>
                    ))}
                    {favoriteFundraisers.length === 0 && (
                      <p className="mx-1 mt-1 rounded-md bg-bg-faint px-2 py-3 text-xs text-text-muted">
                        No favorites yet.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="relative" ref={notificationsRef}>
              <button
                type="button"
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-faint transition-colors"
                aria-label={isNotificationsOpen ? "Close notification preview" : "Open notification preview"}
                aria-expanded={isNotificationsOpen}
                onClick={() => setIsNotificationsOpen((open) => !open)}
              >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16v12H5.17L4 17.17V4z" />
                    <path d="m4 6 8 6 8-6" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-primary text-white text-[10px] font-semibold leading-4 text-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-xl border border-primary/20 bg-white shadow-[0_14px_32px_rgba(16,24,40,0.16)] p-2 z-50">
                  <div className="flex items-center justify-between rounded-lg px-2.5 py-2">
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
                        className="block rounded-md px-2 py-2 transition-colors hover:bg-primary/5"
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
          </div>
          {currentUser ? (
            <div className="ml-1 pl-3 border-l border-border-light flex items-center" ref={profileMenuRef}>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileMenuOpen((open) => !open)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border-light overflow-hidden bg-bg-gray"
                  aria-label={isProfileMenuOpen ? "Close profile menu" : "Open profile menu"}
                  aria-expanded={isProfileMenuOpen}
                  title={currentUser.name}
                >
                  {currentUser.avatarUrl ? (
                    <Image
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      width={36}
                      height={36}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-semibold text-text-primary">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </button>
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-44 rounded-lg border border-border-light bg-white shadow-lg p-1.5 z-50">
                    <Link
                      href={`/profile/${currentUser.id}`}
                      className="block rounded-md px-3 py-2 text-sm text-text-primary hover:bg-bg-faint transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        void handleLogout();
                      }}
                      disabled={isLoggingOut}
                      className="w-full text-left rounded-md px-3 py-2 text-sm text-text-primary hover:bg-bg-faint transition-colors disabled:opacity-60"
                    >
                      {isLoggingOut ? "Signing out..." : "Log out"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link
              href="/sign-in"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Sign in
            </Link>
          )}
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
