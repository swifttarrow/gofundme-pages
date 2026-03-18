"use client";

import { useState } from "react";
import Image from "next/image";
import { SeedDonation, formatCents, timeAgo } from "@/lib/seed-data";

interface DonationFeedProps {
  donations: SeedDonation[];
  totalCount: number;
}

export function DonationFeed({ donations, totalCount }: DonationFeedProps) {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? donations : donations.slice(0, 3);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-text-primary">
          Donations ({totalCount.toLocaleString()})
        </h2>
        {donations.length > 3 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm font-medium text-primary hover:underline"
          >
            {showAll ? "Show less" : "See all"}
          </button>
        )}
      </div>

      <div className="space-y-4">
        {displayed.map((donation) => (
          <DonationRow key={donation.id} donation={donation} />
        ))}
      </div>
    </div>
  );
}

function DonationRow({ donation }: { donation: SeedDonation }) {
  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-bg-gray flex-shrink-0">
        {donation.donorAvatar && !donation.isAnonymous ? (
          <Image
            src={donation.donorAvatar}
            alt={donation.donorName}
            fill
            className="object-cover"
            sizes="40px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="font-semibold text-sm text-text-primary">
            {donation.donorName}
          </span>
          <span className="text-sm text-primary font-medium">
            {formatCents(donation.amountCents)}
          </span>
        </div>
        {donation.message && (
          <p className="text-sm text-text-secondary mt-0.5 leading-snug">
            {donation.message}
          </p>
        )}
        <p className="text-xs text-text-muted mt-1">{timeAgo(donation.createdAt)}</p>
      </div>
    </div>
  );
}
