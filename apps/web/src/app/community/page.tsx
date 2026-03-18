import Link from "next/link";
import Image from "next/image";
import { SEED_COMMUNITIES, SEED_FUNDRAISERS } from "@/lib/seed-data";
import { CampaignCard } from "@/components/community/campaign-card";

export const metadata = {
  title: "Communities | GoSupportMe",
  description: "Discover and join communities that support the causes you care about.",
};

export default function CommunityPage() {
  const standaloneFundraisers = SEED_FUNDRAISERS.filter((f) => f.communityId === null).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text-primary">Discover communities</h1>
          <p className="text-text-secondary mt-2 max-w-3xl">
            Explore communities to find campaigns with shared goals, local focus, and ongoing support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SEED_COMMUNITIES.map((community) => (
            <Link
              key={community.id}
              href={`/community/${community.slug}`}
              className="group block rounded-xl border border-border-light overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative h-36">
                <Image
                  src={community.coverImageUrl}
                  alt={community.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/35" />
              </div>
              <div className="bg-white p-4">
                <h2 className="text-lg font-semibold text-text-primary">{community.name}</h2>
                <p className="text-sm text-text-muted mt-1">
                  {community.memberCount.toLocaleString()} members
                </p>
                <p className="text-sm text-text-secondary mt-2">{community.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-primary">Standalone fundraisers</h2>
          <Link href="/" className="text-primary font-medium hover:underline">
            Back to discover
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {standaloneFundraisers.map((fundraiser) => (
            <CampaignCard key={fundraiser.id} fundraiser={fundraiser} />
          ))}
          {standaloneFundraisers.length === 0 && (
            <div className="text-sm text-text-muted">No standalone fundraisers yet.</div>
          )}
        </div>
      </section>
    </div>
  );
}
