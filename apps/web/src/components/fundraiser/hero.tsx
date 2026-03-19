"use client";

import Image from "next/image";
import { useState } from "react";
import { SeedFundraiser } from "@/lib/seed-data";

interface HeroProps {
  fundraiser: SeedFundraiser;
}

export function FundraiserHero({ fundraiser }: HeroProps) {
  const [copied, setCopied] = useState(false);

  const isLocalCoverImage =
    fundraiser.coverImageUrl.startsWith("data:") || fundraiser.coverImageUrl.startsWith("blob:");

  async function handleShare() {
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: fundraiser.title,
          text: `Support this fundraiser: ${fundraiser.title}`,
          url: shareUrl,
        });
        return;
      } catch {
        // Fall back to copy-to-clipboard if native share is dismissed or unavailable.
      }
    }

    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
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
        <div className="flex-shrink-0">
          <button
            type="button"
            onClick={handleShare}
            title="Share fundraiser"
            aria-label="Share fundraiser"
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
          {copied && (
            <p className="mt-1 text-[11px] text-primary text-right">Copied</p>
          )}
        </div>
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
