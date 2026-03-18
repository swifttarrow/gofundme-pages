import Image from "next/image";
import Link from "next/link";
import { SEED_FUNDRAISERS } from "@/lib/seed-data";
import { FeaturedCampaigns } from "@/components/community/featured-campaigns";
import { CommunityFeed } from "@/components/community/feed";
import { CommunitySidebar } from "@/components/community/sidebar";
import { Filters } from "@/components/community/filters";

export const metadata = {
  title: "Bay Area Community Support | GoSupportMe",
  description: "Neighbors helping neighbors through life's challenges.",
};

export default function CommunityPage() {
  const featured = SEED_FUNDRAISERS.slice(0, 3);
  const totalRaised = SEED_FUNDRAISERS.reduce((sum, f) => sum + f.raisedCents, 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Community hero banner */}
      <div className="relative h-52 md:h-64 overflow-hidden bg-text-primary">
        <Image
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&auto=format&fit=crop"
          alt="Bay Area Community Support"
          fill
          className="object-cover opacity-60"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <h1 className="text-white text-2xl md:text-3xl font-bold">
            Bay Area Community Support
          </h1>
          <p className="text-white/80 text-sm mt-1 max-w-lg">
            Neighbors helping neighbors through life's challenges. Together, we can make a difference.
          </p>
          <p className="text-white/60 text-xs mt-1">2,647 members</p>
        </div>

        {/* Follow button */}
        <div className="absolute top-4 right-4">
          <button className="bg-white text-text-primary text-sm font-semibold px-4 py-2 rounded-md flex items-center gap-1.5 hover:bg-bg-gray transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Follow
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-bg-gray border-b border-border-light">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-8 flex-wrap">
            <div className="text-center">
              <p className="text-lg font-bold text-primary">
                ${(totalRaised / 100).toLocaleString()}
              </p>
              <p className="text-xs text-text-muted">Total Raised</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-text-primary">4,128</p>
              <p className="text-xs text-text-muted">Supporters</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-text-primary">
                {SEED_FUNDRAISERS.length}
              </p>
              <p className="text-xs text-text-muted">Fundraisers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="mb-6">
          <Filters />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main column */}
          <div className="flex-1 min-w-0">
            <FeaturedCampaigns fundraisers={featured} />
            <CommunityFeed />
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <CommunitySidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
