import Link from "next/link";
import Image from "next/image";
import { SEED_COMMUNITIES, SEED_FAVORITES, SEED_FUNDRAISERS } from "@/lib/seed-data";

const CURRENT_USER_ID = "a1b2c3d4-0002-0002-0002-000000000002";

export const metadata = {
  title: "Communities | GoSupportMe",
  description: "Discover and join communities that support the causes you care about.",
};

export default function CommunityPage() {
  const followedCommunityIds = new Set(
    SEED_FAVORITES.filter((favorite) => favorite.userId === CURRENT_USER_ID)
      .map((favorite) => SEED_FUNDRAISERS.find((fundraiser) => fundraiser.id === favorite.fundraiserId)?.communityId)
      .filter((communityId): communityId is string => communityId !== null && communityId !== undefined)
  );

  const followedCommunities = SEED_COMMUNITIES.filter((community) => followedCommunityIds.has(community.id));
  const discoverCommunities = SEED_COMMUNITIES.filter((community) => !followedCommunityIds.has(community.id));

  return (
    <div className="min-h-screen bg-white">
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text-primary">Your communities</h1>
          <p className="text-text-secondary mt-2 max-w-3xl">
            Communities you already follow appear first so you can jump back into causes you care about.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {followedCommunities.map((community) => (
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
          {followedCommunities.length === 0 && (
            <div className="text-sm text-text-muted">You are not following any communities yet.</div>
          )}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-4 pb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-text-primary">Discover communities</h2>
          <p className="text-text-secondary mt-2 max-w-3xl">
            Explore more communities with shared goals, local focus, and ongoing support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {discoverCommunities.map((community) => (
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
          {discoverCommunities.length === 0 && (
            <div className="text-sm text-text-muted">No more communities to discover right now.</div>
          )}
        </div>
      </section>
    </div>
  );
}
