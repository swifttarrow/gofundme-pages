"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SeedFundraiser } from "@/lib/seed-data";

interface HeroProps {
  fundraiser: SeedFundraiser;
  currentUserId?: string;
}

type ShareChannel = "instagram" | "snapchat" | "facebook" | "linkedin" | "whatsapp" | "tiktok";

const SHARE_OPTIONS: Array<{
  id: ShareChannel;
  label: string;
}> = [
  { id: "instagram", label: "Instagram" },
  { id: "snapchat", label: "Snapchat" },
  { id: "facebook", label: "Facebook" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "tiktok", label: "TikTok" },
];

function ShareOptionIcon({ channel }: { channel: ShareChannel }) {
  if (channel === "instagram") {
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="4.25" y="4.25" width="15.5" height="15.5" rx="4.5" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="2" />
          <circle cx="17.25" cy="6.75" r="1.25" fill="currentColor" />
        </svg>
      </span>
    );
  }

  if (channel === "snapchat") {
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFFC00] text-black">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 3.2c2.58 0 4.67 2.04 4.67 4.56v2.21c0 .45.23.86.61 1.1.46.29.96.47 1.51.54.43.06.73.45.67.88-.05.34-.31.61-.66.67-.56.11-1.09.35-1.55.68-.25.18-.39.47-.36.78.08.95.59 1.8 1.39 2.31.29.18.41.54.29.85-.11.3-.42.49-.74.45-.64-.08-1.3.05-1.85.36-.46.26-.84.63-1.09 1.09l-.35.64a.83.83 0 0 1-.73.43h-3.62a.83.83 0 0 1-.73-.43l-.35-.64a3.3 3.3 0 0 0-1.09-1.09 3.26 3.26 0 0 0-1.85-.36.75.75 0 0 1-.74-.45.76.76 0 0 1 .29-.85c.8-.51 1.31-1.36 1.39-2.31a.95.95 0 0 0-.36-.78 3.5 3.5 0 0 0-1.55-.68.76.76 0 0 1-.66-.67.77.77 0 0 1 .67-.88c.55-.07 1.05-.25 1.51-.54.38-.24.61-.65.61-1.1V7.76C7.33 5.24 9.42 3.2 12 3.2Z" />
        </svg>
      </span>
    );
  }

  if (channel === "facebook") {
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#1877F2] text-white">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M13.36 20v-7.02h2.36l.35-2.73h-2.71V8.5c0-.79.22-1.33 1.35-1.33H16V4.73c-.23-.03-1.03-.09-1.96-.09-1.94 0-3.27 1.18-3.27 3.36v2.25H8.57v2.73h2.2V20h2.59Z" />
        </svg>
      </span>
    );
  }

  if (channel === "linkedin") {
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#0A66C2] text-white">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M6.94 8.5A1.56 1.56 0 1 1 6.95 5.4 1.56 1.56 0 0 1 6.94 8.5ZM5.65 18.6h2.58V9.82H5.65V18.6ZM10.57 9.82h2.47v1.2h.04c.34-.65 1.18-1.34 2.43-1.34 2.6 0 3.08 1.71 3.08 3.93v4.99H16V14.17c0-1.06-.02-2.43-1.48-2.43-1.48 0-1.71 1.16-1.71 2.35v4.51h-2.24V9.82Z" />
        </svg>
      </span>
    );
  }

  if (channel === "whatsapp") {
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#25D366] text-white">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.52 11.87c0 4.66-3.84 8.43-8.57 8.43a8.6 8.6 0 0 1-4.12-1.04L3.5 20.5l1.3-4.2a8.27 8.27 0 0 1-1.42-4.43c0-4.66 3.84-8.43 8.57-8.43s8.57 3.77 8.57 8.43Zm-8.57-7.08a7.18 7.18 0 0 0-6.02 11.06l.19.3-.77 2.5 2.57-.75.29.17a7.23 7.23 0 0 0 3.74 1.04 7.32 7.32 0 0 0 7.23-7.24 7.32 7.32 0 0 0-7.23-7.08Zm3.97 9.2c-.22-.11-1.3-.64-1.5-.72-.2-.07-.34-.11-.48.11-.15.22-.56.72-.69.87-.13.14-.26.17-.48.05-.22-.11-.94-.35-1.78-1.11-.66-.58-1.1-1.3-1.23-1.52-.13-.22-.01-.34.1-.45.1-.1.22-.26.33-.39.11-.13.15-.22.22-.36.07-.14.04-.27-.02-.38-.06-.11-.48-1.16-.66-1.59-.17-.41-.34-.35-.48-.36h-.41c-.14 0-.36.05-.55.25-.19.2-.72.7-.72 1.71 0 1 .74 1.98.84 2.11.11.14 1.46 2.23 3.54 3.12.5.22.88.35 1.18.45.5.16.96.14 1.31.08.4-.06 1.3-.53 1.48-1.05.18-.52.18-.96.13-1.05-.06-.1-.2-.15-.42-.26Z" />
        </svg>
      </span>
    );
  }

  return (
    <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-lg bg-black text-white">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="absolute translate-x-[1px] -translate-y-[1px] text-[#25F4EE]"
      >
        <path
          d="M14.2 4.5v8.03a3.63 3.63 0 1 1-2.62-3.48v2.23a1.44 1.44 0 1 0 .46 1.06V4.5h2.16c.25 2.15 1.44 3.69 3.3 4.02v2.16a6.18 6.18 0 0 1-3.3-1.45V4.5h0Z"
          fill="currentColor"
        />
      </svg>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="absolute -translate-x-[1px] translate-y-[1px] text-[#FE2C55]"
      >
        <path
          d="M14.2 4.5v8.03a3.63 3.63 0 1 1-2.62-3.48v2.23a1.44 1.44 0 1 0 .46 1.06V4.5h2.16c.25 2.15 1.44 3.69 3.3 4.02v2.16a6.18 6.18 0 0 1-3.3-1.45V4.5h0Z"
          fill="currentColor"
        />
      </svg>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="relative">
        <path d="M14.2 4.5v8.03a3.63 3.63 0 1 1-2.62-3.48v2.23a1.44 1.44 0 1 0 .46 1.06V4.5h2.16c.25 2.15 1.44 3.69 3.3 4.02v2.16a6.18 6.18 0 0 1-3.3-1.45V4.5h0Z" />
      </svg>
    </span>
  );
}

export function FundraiserHero({ fundraiser, currentUserId }: HeroProps) {
  const [copied, setCopied] = useState(false);
  const [copyLabel, setCopyLabel] = useState("Copied");
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);
  const copiedTimerRef = useRef<number | null>(null);

  const isLocalCoverImage =
    fundraiser.coverImageUrl.startsWith("data:") || fundraiser.coverImageUrl.startsWith("blob:");

  useEffect(() => {
    if (!isShareMenuOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (!shareMenuRef.current?.contains(event.target as Node)) {
        setIsShareMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsShareMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isShareMenuOpen]);

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current) {
        window.clearTimeout(copiedTimerRef.current);
      }
    };
  }, []);

  function announceCopied(message = "Copied") {
    setCopied(true);
    setCopyLabel(message);
    if (copiedTimerRef.current) {
      window.clearTimeout(copiedTimerRef.current);
    }
    copiedTimerRef.current = window.setTimeout(() => setCopied(false), 2200);
  }

  async function copyShareLink(message = "Copied") {
    try {
      await navigator.clipboard.writeText(window.location.href);
      announceCopied(message);
    } catch {
      announceCopied("Copy failed");
    }
  }

  async function openNativeShareSheet(channelLabel: string) {
    if (!navigator.share) {
      await copyShareLink(`Link copied for ${channelLabel}`);
      return;
    }

    try {
      await navigator.share({
        title: fundraiser.title,
        text: `Support this fundraiser: ${fundraiser.title}`,
        url: window.location.href,
      });
      announceCopied(`Shared via ${channelLabel}`);
    } catch {
      await copyShareLink(`Link copied for ${channelLabel}`);
    }
  }

  function openShareUrl(channel: Exclude<ShareChannel, "instagram" | "tiktok">) {
    const shareUrl = window.location.href;
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(`Support this fundraiser: ${fundraiser.title} ${shareUrl}`);

    const destinations: Record<Exclude<ShareChannel, "instagram" | "tiktok">, string> = {
      snapchat: `https://www.snapchat.com/share?link=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedText}`,
    };

    window.open(destinations[channel], "_blank", "noopener,noreferrer");
    announceCopied(`Opened ${SHARE_OPTIONS.find((option) => option.id === channel)?.label ?? "share"}`);
  }

  async function handleShareOption(channel: ShareChannel) {
    setIsShareMenuOpen(false);

    if (channel === "instagram" || channel === "tiktok") {
      await openNativeShareSheet(
        SHARE_OPTIONS.find((option) => option.id === channel)?.label ?? "share"
      );
      return;
    }

    openShareUrl(channel);
  }

  return (
    <div>
      {/* Cover Image */}
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-lg overflow-hidden bg-bg-gray">
        {isLocalCoverImage ? (
          <img
            src={fundraiser.coverImageUrl}
            alt={fundraiser.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <Image
            src={fundraiser.coverImageUrl}
            alt={fundraiser.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 60vw"
          />
        )}
        {fundraiser.isUrgent && (
          <div className="absolute top-3 left-3">
            <span className="bg-accent-red text-white text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-wide">
              Urgent
            </span>
          </div>
        )}
      </div>

      {/* Title */}
      <div className="mt-5 flex items-start justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary leading-tight">
          {fundraiser.title}
        </h1>
        {currentUserId ? (
          <div className="relative flex-shrink-0" ref={shareMenuRef}>
            <button
              type="button"
              onClick={() => setIsShareMenuOpen((open) => !open)}
              title="Share fundraiser"
              aria-label="Share fundraiser"
              aria-expanded={isShareMenuOpen}
              aria-haspopup="menu"
              className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-border-medium text-text-secondary hover:text-primary hover:border-primary transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </button>
            {isShareMenuOpen && (
              <div className="absolute right-0 top-full z-20 mt-2 w-72 rounded-xl border border-border-light bg-white p-2 shadow-[0_14px_32px_rgba(16,24,40,0.16)]">
                <p className="px-2 pb-2 text-xs font-medium text-text-muted">Share this fundraiser</p>
                <div className="grid grid-cols-2 gap-2">
                  {SHARE_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => void handleShareOption(option.id)}
                      className="flex items-center gap-2 rounded-lg border border-border-light px-3 py-2 text-left text-sm text-text-primary transition-colors hover:border-primary hover:bg-primary/5"
                    >
                      <ShareOptionIcon channel={option.id} />
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsShareMenuOpen(false);
                    void copyShareLink("Link copied");
                  }}
                  className="mt-2 w-full rounded-lg bg-bg-faint px-3 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-primary/10"
                >
                  Copy link
                </button>
              </div>
            )}
            {copied && (
              <p className="mt-1 text-[11px] text-primary text-right">{copyLabel}</p>
            )}
          </div>
        ) : null}
      </div>

      {/* Organizer badge */}
      <div className="flex items-center gap-2 mt-3">
        <div className="relative w-6 h-6 rounded-full overflow-hidden bg-primary flex-shrink-0">
          {fundraiser.organizerAvatar ? (
            <Image
              src={fundraiser.organizerAvatar}
              alt={fundraiser.organizerName}
              fill
              className="object-cover"
              sizes="24px"
            />
          ) : (
            <span className="text-white text-xs flex items-center justify-center h-full font-bold">
              {fundraiser.organizerName.charAt(0)}
            </span>
          )}
        </div>
        <span className="text-sm text-text-secondary">
          <span className="text-text-primary font-medium">{fundraiser.organizerName}</span>
          {" "}is organizing this fundraiser for{" "}
          <span className="font-medium">Martinez Family</span>
        </span>
      </div>

      {/* Category tag */}
      <div className="mt-2">
        <span className="text-xs text-text-muted">{fundraiser.category}</span>
        {fundraiser.location && (
          <span className="text-xs text-text-muted"> · {fundraiser.location}</span>
        )}
      </div>
    </div>
  );
}
