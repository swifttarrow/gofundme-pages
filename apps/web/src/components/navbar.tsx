"use client";

import Link from "next/link";
import Image from "next/image";
import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MeerkatMascot } from "@/components/meerkat-mascot";
import {
  AppNotification,
  AuthUser,
  FundraiserSummary,
  getCurrentUser,
  getFundraisers,
  getNotifications,
  logout,
} from "@/lib/api";
import { trackEvent } from "@/lib/analytics";
import { SEED_FAVORITES, SEED_FUNDRAISERS, formatCents, timeAgo } from "@/lib/seed-data";
import { APP_DATA_REFRESH_EVENT } from "@/lib/client-events";

const NAV_DROPDOWN_LIMIT = 4;
const FAVORITES_PREVIEW_LIMIT = 3;
const CURRENT_USER_ID = "a1b2c3d4-0002-0002-0002-000000000002";
const SEARCH_SUGGESTION_LIMIT = 5;
const SEARCH_DEBOUNCE_MS = 250;
const MIN_SEARCH_CHARACTERS = 2;

function SearchParamsSync({
  pathname,
  onValueChange,
}: {
  pathname: string;
  onValueChange: (value: string) => void;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname === "/search") {
      onValueChange(searchParams.get("q") ?? "");
      return;
    }

    onValueChange("");
  }, [onValueChange, pathname, searchParams]);

  return null;
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCreateMenuOpen, setIsMobileCreateMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<FundraiserSummary[]>([]);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [recentNotifications, setRecentNotifications] = useState<AppNotification[]>([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const favoritesRef = useRef<HTMLDivElement>(null);
  const createMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  const unreadCount = recentNotifications.filter((notification) => !notification.isRead).length;
  const previewNotifications = recentNotifications.slice(0, NAV_DROPDOWN_LIMIT);
  const favoriteFundraisers = SEED_FAVORITES
    .filter((favorite) => favorite.userId === CURRENT_USER_ID)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((favorite) => SEED_FUNDRAISERS.find((fundraiser) => fundraiser.id === favorite.fundraiserId))
    .filter((fundraiser): fundraiser is NonNullable<typeof fundraiser> => fundraiser !== undefined)
    .slice(0, FAVORITES_PREVIEW_LIMIT);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!searchRef.current?.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setIsSearchFocused(false);
      }
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
      const clickTarget = event.target as Node;
      if (
        !mobileMenuRef.current?.contains(clickTarget) &&
        !mobileMenuButtonRef.current?.contains(clickTarget)
      ) {
        setIsMobileMenuOpen(false);
        setIsMobileCreateMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileCreateMenuOpen(false);
    setIsNotificationsOpen(false);
    setIsFavoritesOpen(false);
    setIsCreateMenuOpen(false);
    setIsProfileMenuOpen(false);
    setIsSearchOpen(false);
    setIsSearchFocused(false);
  }, [pathname]);

  useEffect(() => {
    const query = searchValue.trim();

    if (query.length < MIN_SEARCH_CHARACTERS) {
      setSearchSuggestions([]);
      setIsSearchLoading(false);
      return;
    }

    let cancelled = false;
    setIsSearchLoading(true);

    const timeoutId = window.setTimeout(async () => {
      try {
        const result = await getFundraisers({
          search: query,
          limit: SEARCH_SUGGESTION_LIMIT,
        });
        if (!cancelled) {
          setSearchSuggestions(result.fundraisers);
          if (isSearchFocused) {
            setIsSearchOpen(true);
          }
        }
      } catch {
        if (!cancelled) {
          setSearchSuggestions([]);
          if (isSearchFocused) {
            setIsSearchOpen(true);
          }
        }
      } finally {
        if (!cancelled) {
          setIsSearchLoading(false);
        }
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [isSearchFocused, searchValue]);

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

  useEffect(() => {
    let cancelled = false;

    async function loadNotifications(userId: string) {
      try {
        const result = await getNotifications({
          userId,
          limit: 20,
        });
        if (!cancelled) {
          setRecentNotifications(result.notifications);
        }
      } catch {
        if (!cancelled) {
          setRecentNotifications([]);
        }
      }
    }

    if (!currentUser) {
      setRecentNotifications([]);
      return;
    }

    void loadNotifications(currentUser.id);

    const onRefresh = () => {
      void loadNotifications(currentUser.id);
    };

    window.addEventListener(APP_DATA_REFRESH_EVENT, onRefresh);
    return () => {
      cancelled = true;
      window.removeEventListener(APP_DATA_REFRESH_EVENT, onRefresh);
    };
  }, [currentUser, pathname]);

  async function handleLogout() {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
      setCurrentUser(null);
      setIsMobileMenuOpen(false);
      setIsMobileCreateMenuOpen(false);
      router.push("/sign-in");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  }

  function handleCreateCtaClick(kind: "fundraiser" | "charity", placement: "desktop" | "mobile") {
    if (kind === "fundraiser") {
      trackEvent("create_fundraiser_cta_clicked", {
        placement,
        signed_in: Boolean(currentUser),
      });
      return;
    }

    trackEvent("create_charity_cta_clicked", {
      placement,
      signed_in: Boolean(currentUser),
    });
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = searchValue.trim();
    trackEvent("search_submitted", {
      query_length: query.length,
      has_query: query.length > 0,
    });
    setIsSearchOpen(false);
    setIsSearchFocused(false);
    if (!query) {
      router.push("/search");
      return;
    }

    const qs = new URLSearchParams({ q: query });
    router.push(`/search?${qs.toString()}`);
  }

  function handleSearchFocus() {
    setIsSearchFocused(true);
    if (searchValue.trim().length >= MIN_SEARCH_CHARACTERS) {
      setIsSearchOpen(true);
    }
  }

  function handleSuggestionSelect(suggestion: Pick<FundraiserSummary, "id" | "title">) {
    trackEvent("search_suggestion_selected", {
      suggestion_id: suggestion.id,
      query_length: searchValue.trim().length,
    });
    setSearchValue(suggestion.title);
    setIsSearchOpen(false);
    setIsSearchFocused(false);
  }

  const showSearchDropdown =
    isSearchOpen && searchValue.trim().length >= MIN_SEARCH_CHARACTERS;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border-light">
      <Suspense fallback={null}>
        <SearchParamsSync pathname={pathname} onValueChange={setSearchValue} />
      </Suspense>
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 flex-shrink-0">
          <MeerkatMascot size="sm" className="h-8 w-8" />
          <span className="font-bold text-text-primary text-base hidden sm:block">
            GoSupportMe
          </span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-sm" ref={searchRef}>
          <form className="relative" onSubmit={handleSearchSubmit}>
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
              aria-label="Search fundraisers"
              type="text"
              placeholder="Search fundraisers..."
              value={searchValue}
              onFocus={handleSearchFocus}
              onChange={(e) => setSearchValue(e.target.value)}
              aria-expanded={showSearchDropdown}
              aria-controls="navbar-search-suggestions"
              aria-autocomplete="list"
              autoComplete="off"
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-bg-gray border border-border-light rounded-md
                         focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20
                         text-text-primary placeholder:text-text-muted"
            />
            {showSearchDropdown ? (
              <div
                id="navbar-search-suggestions"
                className="absolute left-0 right-0 mt-2 overflow-hidden rounded-xl border border-border-light bg-white shadow-[0_14px_32px_rgba(16,24,40,0.12)] z-50"
                role="listbox"
              >
                {isSearchLoading ? (
                  <p className="px-3 py-3 text-sm text-text-secondary">Searching...</p>
                ) : searchSuggestions.length > 0 ? (
                  <>
                    <div className="max-h-80 overflow-y-auto p-1.5">
                      {searchSuggestions.map((suggestion) => (
                        <Link
                          key={suggestion.id}
                          href={`/fundraiser/${suggestion.id}`}
                          className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-primary/5"
                          role="option"
                          onClick={() => handleSuggestionSelect(suggestion)}
                        >
                          <p className="text-sm font-medium text-text-primary line-clamp-1">
                            {suggestion.title}
                          </p>
                          <p className="mt-1 text-xs text-text-secondary line-clamp-1">
                            {suggestion.organizerName}
                            {suggestion.category ? ` · ${suggestion.category}` : ""}
                            {suggestion.location ? ` · ${suggestion.location}` : ""}
                          </p>
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-border-light px-3 py-2">
                      <button
                        type="submit"
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        See all results for "{searchValue.trim()}"
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="px-3 py-3">
                    <p className="text-sm font-medium text-text-primary">No matches yet</p>
                    <p className="mt-1 text-xs text-text-secondary">
                      Try a fundraiser title, organizer name, category, or location.
                    </p>
                  </div>
                )}
              </div>
            ) : null}
          </form>
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
                  href={currentUser ? "/fundraiser/new?source=primary_cta" : "/sign-in"}
                  className="block rounded-md px-3 py-2 text-sm text-text-primary hover:bg-bg-faint transition-colors"
                  onClick={() => {
                    handleCreateCtaClick("fundraiser", "desktop");
                    setIsCreateMenuOpen(false);
                  }}
                >
                  Create fundraiser
                </Link>
                <Link
                  href={currentUser ? "/charity/new?source=primary_cta" : "/sign-in"}
                  className="block rounded-md px-3 py-2 text-sm text-text-primary hover:bg-bg-faint transition-colors"
                  onClick={() => {
                    handleCreateCtaClick("charity", "desktop");
                    setIsCreateMenuOpen(false);
                  }}
                >
                  Create charity
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center gap-0.5">
            {currentUser ? (
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
            ) : null}
            {currentUser ? (
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
                      {recentNotifications.length > 0 ? (
                        previewNotifications.map((notification) => (
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
                        ))
                      ) : (
                        <p className="mx-1 mt-1 rounded-md bg-bg-faint px-2 py-3 text-xs text-text-muted">
                          No notifications yet.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
          {currentUser ? (
            <div className="ml-1 pl-3 border-l border-border-light flex items-center" ref={profileMenuRef}>
              <div className="relative">
                <div className="flex items-center gap-1">
                  <Link
                    href={`/profile/${currentUser.id}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border-light overflow-hidden bg-bg-gray"
                    aria-label={`View ${currentUser.name}'s profile`}
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
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsProfileMenuOpen((open) => !open)}
                    className="inline-flex h-9 w-7 items-center justify-center rounded-md text-text-secondary hover:bg-bg-faint hover:text-text-primary transition-colors"
                    aria-label={isProfileMenuOpen ? "Close profile menu" : "Open profile menu"}
                    aria-expanded={isProfileMenuOpen}
                    aria-haspopup="menu"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                </div>
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
          type="button"
          ref={mobileMenuButtonRef}
          className="md:hidden ml-auto p-2 text-text-secondary hover:text-text-primary"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation-menu"
          onClick={() => {
            setIsMobileMenuOpen((open) => !open);
            setIsMobileCreateMenuOpen(false);
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
      {isMobileMenuOpen && (
        <div
          id="mobile-navigation-menu"
          ref={mobileMenuRef}
          className="md:hidden border-t border-border-light bg-white"
        >
          <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            <Link
              href="/"
              className="rounded-md px-3 py-2 text-sm font-medium text-text-primary hover:bg-bg-faint transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Discover
            </Link>
            <Link
              href="/community"
              className="rounded-md px-3 py-2 text-sm font-medium text-text-primary hover:bg-bg-faint transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Communities
            </Link>
            <div className="rounded-md border border-border-light bg-bg-gray/40">
              <button
                type="button"
                className="flex w-full items-center justify-between px-3 py-2 text-sm font-semibold text-text-primary"
                aria-label={isMobileCreateMenuOpen ? "Close create menu" : "Open create menu"}
                aria-expanded={isMobileCreateMenuOpen}
                onClick={() => setIsMobileCreateMenuOpen((open) => !open)}
              >
                <span>Create +</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={isMobileCreateMenuOpen ? "rotate-180 transition-transform" : "transition-transform"}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {isMobileCreateMenuOpen && (
                <div className="border-t border-border-light px-2 py-2">
                  <Link
                    href={currentUser ? "/fundraiser/new?source=primary_cta" : "/sign-in"}
                    className="block rounded-md px-3 py-2 text-sm text-text-primary hover:bg-bg-faint transition-colors"
                    onClick={() => {
                      handleCreateCtaClick("fundraiser", "mobile");
                      setIsMobileMenuOpen(false);
                      setIsMobileCreateMenuOpen(false);
                    }}
                  >
                    Create fundraiser
                  </Link>
                  <Link
                    href={currentUser ? "/charity/new?source=primary_cta" : "/sign-in"}
                    className="block rounded-md px-3 py-2 text-sm text-text-primary hover:bg-bg-faint transition-colors"
                    onClick={() => {
                      handleCreateCtaClick("charity", "mobile");
                      setIsMobileMenuOpen(false);
                      setIsMobileCreateMenuOpen(false);
                    }}
                  >
                    Create charity
                  </Link>
                </div>
              )}
            </div>
            {currentUser ? (
              <>
                <Link
                  href="/favorites"
                  className="rounded-md px-3 py-2 text-sm font-medium text-text-primary hover:bg-bg-faint transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Favorites
                </Link>
                <Link
                  href="/notifications"
                  className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-text-primary hover:bg-bg-faint transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>Notifications</span>
                  {unreadCount > 0 ? (
                    <span className="min-w-5 rounded-full bg-primary px-1.5 py-0.5 text-center text-[11px] font-semibold text-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  ) : null}
                </Link>
                <Link
                  href={`/profile/${currentUser.id}`}
                  className="rounded-md px-3 py-2 text-sm font-medium text-text-primary hover:bg-bg-faint transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    void handleLogout();
                  }}
                  disabled={isLoggingOut}
                  className="rounded-md px-3 py-2 text-left text-sm font-medium text-text-primary hover:bg-bg-faint transition-colors disabled:opacity-60"
                >
                  {isLoggingOut ? "Signing out..." : "Log out"}
                </button>
              </>
            ) : (
              <Link
                href="/sign-in"
                className="rounded-md px-3 py-2 text-sm font-medium text-text-primary hover:bg-bg-faint transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign in
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
