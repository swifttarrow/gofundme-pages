"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { SeedDonation, formatCents, timeAgo } from "@/lib/seed-data";

interface DonationFeedProps {
  donations: SeedDonation[];
  totalCount: number;
  currentUserId?: string;
}

type SuggestedDonor = {
  donorUserId: string;
  donorName: string;
  donorAvatar: string | null;
  amountCents: number;
  message: string | null;
  createdAt: string;
};

export function DonationFeed({ donations, totalCount, currentUserId }: DonationFeedProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [followedDonors, setFollowedDonors] = useState<Record<string, boolean>>({});

  const suggestedDonors = useMemo<SuggestedDonor[]>(() => {
    const donors = new Map<string, SuggestedDonor>();

    for (const donation of donations) {
      if (donation.isAnonymous || !donation.donorUserId || donors.has(donation.donorUserId)) continue;

      donors.set(donation.donorUserId, {
        donorUserId: donation.donorUserId,
        donorName: donation.donorName,
        donorAvatar: donation.donorAvatar,
        amountCents: donation.amountCents,
        message: donation.message,
        createdAt: donation.createdAt,
      });
    }

    return Array.from(donors.values());
  }, [donations]);

  function scrollCarousel(direction: "prev" | "next") {
    const node = carouselRef.current;
    if (!node) return;
    const distance = Math.max(node.clientWidth * 0.85, 280);
    node.scrollBy({ left: direction === "next" ? distance : -distance, behavior: "smooth" });
  }

  function toggleFollow(donorUserId: string) {
    setFollowedDonors((prev) => ({ ...prev, [donorUserId]: !prev[donorUserId] }));
  }

  if (!currentUserId) {
    return null;
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-text-primary">
          Donors you may know ({totalCount.toLocaleString()})
        </h2>
        {suggestedDonors.length > 1 ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollCarousel("prev")}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border-medium text-text-secondary transition-colors hover:border-primary hover:text-primary"
              aria-label="Scroll donors left"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollCarousel("next")}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border-medium text-text-secondary transition-colors hover:border-primary hover:text-primary"
              aria-label="Scroll donors right"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        ) : null}
      </div>

      {suggestedDonors.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border-medium bg-bg-faint px-4 py-6 text-sm text-text-secondary">
          Visible donor profiles will show up here after supporters contribute without donating anonymously.
        </div>
      ) : (
        <div ref={carouselRef} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 no-scrollbar">
          {suggestedDonors.map((donor) => {
            const isSelf = donor.donorUserId === currentUserId;
            const isFollowed = Boolean(followedDonors[donor.donorUserId]);

            return (
              <article
                key={donor.donorUserId}
                className="min-w-[270px] max-w-[270px] snap-start rounded-2xl border border-border-light bg-white p-4 shadow-sm"
              >
                <Link href={`/profile/${donor.donorUserId}`} className="block">
                  <div className="flex items-start gap-3">
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-bg-gray">
                      {donor.donorAvatar ? (
                        <Image
                          src={donor.donorAvatar}
                          alt={donor.donorName}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-primary text-base font-bold text-white">
                          {donor.donorName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-text-primary">{donor.donorName}</p>
                      <p className="mt-0.5 text-xs text-text-muted">
                        Donated {formatCents(donor.amountCents)} • {timeAgo(donor.createdAt)}
                      </p>
                    </div>
                  </div>
                </Link>

                <p className="mt-3 min-h-[60px] line-clamp-3 text-sm leading-relaxed text-text-secondary">
                  {donor.message ?? "Recently supported this fundraiser and may share causes with you."}
                </p>

                <div className="mt-4 flex items-center justify-between gap-2">
                  <Link
                    href={`/profile/${donor.donorUserId}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    View profile
                  </Link>
                  {isSelf ? (
                    <span className="rounded-md bg-bg-faint px-3 py-1.5 text-xs font-semibold text-text-secondary">
                      You
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => toggleFollow(donor.donorUserId)}
                      disabled={!currentUserId}
                      className={`rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${
                        isFollowed
                          ? "bg-primary-light text-primary"
                          : "bg-primary text-white hover:bg-primary-dark"
                      } disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      {isFollowed ? "Following" : "Follow"}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
