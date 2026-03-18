import Image from "next/image";
import Link from "next/link";
import { SeedFundraiser, formatCents } from "@/lib/seed-data";

interface FundraiserListProps {
  fundraisers: SeedFundraiser[];
}

export function FundraiserList({ fundraisers }: FundraiserListProps) {
  if (fundraisers.length === 0) {
    return (
      <div className="text-center py-12 text-text-muted">
        <p>No fundraisers yet.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-text-primary mb-4">My Fundraisers</h2>
      <div className="space-y-4">
        {fundraisers.map((f) => (
          <Link key={f.id} href={`/fundraiser/${f.id}`} className="block group">
            <div className="flex gap-4 p-3 border border-border-light rounded-lg hover:border-primary/30 hover:shadow-sm transition-all">
              {/* Thumbnail */}
              <div className="relative w-24 h-16 sm:w-32 sm:h-20 flex-shrink-0 rounded-md overflow-hidden bg-bg-gray">
                <Image
                  src={f.coverImageUrl}
                  alt={f.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="128px"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-text-primary line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                  {f.title}
                </h3>

                {/* Progress bar */}
                <div className="mt-2 h-1.5 bg-border-light rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${Math.min(f.progressPercent, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-semibold text-primary">
                    {formatCents(f.raisedCents)} raised
                  </span>
                  <span className="text-xs text-text-muted">
                    {f.donorCount.toLocaleString()} donors
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
