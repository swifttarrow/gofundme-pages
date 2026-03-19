import Link from "next/link";
import Image from "next/image";
import { SEED_COMMUNITIES, SEED_FAVORITES, SEED_FUNDRAISERS } from "@/lib/seed-data";
import { serverApiFetch } from "@/lib/server-api";

export const metadata = {
  title: "Communities | GoSupportMe",
  description: "Discover and join communities that support the causes you care about.",
};

async function getAuthenticatedUserId(): Promise<string | null> {
  try {
    const response = await serverApiFetch("/api/auth/me", { cache: "no-store" });
    if (!response.ok) return null;
    const payload = (await response.json()) as { user: { id: string } };
    return payload.user.id;
  } catch {
    return null;
  }
}

export default async function CommunityPage() {
  const currentUserId = await getAuthenticatedUserId();
  const followedCommunityIds = new Set(
    SEED_FAVORITES.filter((favorite) => favorite.userId === currentUserId)
      .map((favorite) => SEED_FUNDRAISERS.find((fundraiser) => fundraiser.id === favorite.fundraiserId)?.communityId)
      .filter((communityId): communityId is string => communityId !== null && communityId !== undefined)
  );

  const followedCommunities = SEED_COMMUNITIES.filter((community) => followedCommunityIds.has(community.id));
  const discoverCommunities = SEED_COMMUNITIES.filter((community) => !followedCommunityIds.has(community.id));
  const allCommunities = SEED_COMMUNITIES;

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

      <section className="max-w-6xl mx-auto px-4 py-4 pb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-text-primary">All communities</h2>
          <p className="text-text-secondary mt-2 max-w-3xl">
            Browse every community in one place and jump directly into the groups that match your interests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {allCommunities.map((community) => {
            const isFollowed = followedCommunityIds.has(community.id);

            return (
              <Link
                key={community.id}
                href={`/community/${community.slug}`}
                className="group flex gap-4 rounded-xl border border-border-light bg-white p-4 hover:border-primary/30 hover:shadow-sm transition-all"
              >
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-bg-gray">
                  <Image
                    src={community.coverImageUrl}
                    alt={community.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="80px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-semibold text-text-primary line-clamp-2">
                      {community.name}
                    </h3>
                    <span
                      className={`inline-flex flex-shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        isFollowed
                          ? "bg-primary-light text-primary"
                          : "bg-bg-faint text-text-muted"
                      }`}
                    >
                      {isFollowed ? "Following" : "Explore"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-text-muted">
                    {community.memberCount.toLocaleString()} members
                  </p>
                  <p className="mt-2 text-sm text-text-secondary line-clamp-2">
                    {community.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
