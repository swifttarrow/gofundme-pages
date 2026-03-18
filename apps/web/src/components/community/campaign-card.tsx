import Image from "next/image";
import Link from "next/link";
import { SeedFundraiser, formatCents } from "@/lib/seed-data";

interface CampaignCardProps {
  fundraiser: SeedFundraiser;
  size?: "sm" | "md";
}

export function CampaignCard({ fundraiser, size = "md" }: CampaignCardProps) {
  const progressPercent = Math.min(fundraiser.progressPercent, 100);

  return (
    <Link href={`/fundraiser/${fundraiser.id}`} className="block group">
      <div className="bg-white border border-border-light rounded-lg overflow-hidden hover:shadow-md transition-shadow">
        {/* Image */}
        <div
          className={`relative w-full overflow-hidden bg-bg-gray ${
            size === "sm" ? "h-32" : "h-44"
          }`}
        >
          <Image
            src={fundraiser.coverImageUrl}
            alt={fundraiser.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {fundraiser.isUrgent && (
            <div className="absolute top-2 left-2">
              <span className="bg-accent-red text-white text-xs font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide">
                Urgent
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="font-semibold text-sm text-text-primary line-clamp-2 group-hover:text-primary transition-colors leading-snug">
            {fundraiser.title}
          </h3>

          {/* Progress bar */}
          <div className="mt-2 h-1.5 bg-border-light rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Stats */}
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm font-bold text-text-primary">
              {formatCents(fundraiser.raisedCents)} raised
            </span>
            <span className="text-xs text-text-muted">
              {fundraiser.donorCount.toLocaleString()} donors
            </span>
          </div>

          {/* Category / location */}
          <div className="mt-1">
            <span className="text-xs text-text-muted">{fundraiser.category}</span>
            {fundraiser.location && (
              <span className="text-xs text-text-muted"> · {fundraiser.location}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
