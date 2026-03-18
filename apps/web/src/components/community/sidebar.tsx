import Link from "next/link";
import { SEED_COMMUNITIES, SEED_FUNDRAISERS, formatCents } from "@/lib/seed-data";

export function CommunitySidebar() {
  const trending = SEED_FUNDRAISERS
    .filter((f) => f.donorCount > 500)
    .sort((a, b) => b.donorCount - a.donorCount)
    .slice(0, 3);

  return (
    <aside className="space-y-6">
      {/* Related Communities */}
      <div className="bg-white border border-border-light rounded-lg p-4">
        <h3 className="font-bold text-sm text-text-primary mb-3">Related Communities</h3>
        <div className="space-y-2">
          {SEED_COMMUNITIES.map((c) => (
            <Link key={c.id} href={`/community/${c.slug}`} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00B964" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{c.name}</p>
                <p className="text-xs text-text-muted">{c.memberCount.toLocaleString()} members</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Trending Fundraisers */}
      <div className="bg-white border border-border-light rounded-lg p-4">
        <h3 className="font-bold text-sm text-text-primary mb-3">Trending Fundraisers</h3>
        <div className="space-y-3">
          {trending.map((f) => (
            <Link
              key={f.id}
              href={`/fundraiser/${f.id}`}
              className="block hover:text-primary transition-colors"
            >
              <p className="text-sm font-medium text-text-primary line-clamp-2 hover:text-primary leading-snug">
                {f.title}
              </p>
              <p className="text-xs text-primary font-semibold mt-0.5">
                {formatCents(f.raisedCents)} raised
              </p>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
