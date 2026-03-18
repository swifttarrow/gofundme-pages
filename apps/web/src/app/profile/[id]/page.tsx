import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  SEED_USERS,
  SEED_FUNDRAISERS,
  SEED_DONATIONS,
  SEED_FAVORITES,
  formatCents,
  timeAgo,
} from "@/lib/seed-data";
import { ProfileHeader } from "@/components/profile/header";
import { FundraiserList } from "@/components/profile/fundraiser-list";

type ProfileTab = "fundraisers" | "donations" | "following";
const CURRENT_USER_ID = "a1b2c3d4-0002-0002-0002-000000000002";

interface ProfilePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export async function generateStaticParams() {
  return SEED_USERS.map((u) => ({ id: u.id }));
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const { id } = await params;
  const user = SEED_USERS.find((u) => u.id === id);
  if (!user) return { title: "Profile Not Found" };
  return { title: `${user.name} | GoSupportMe` };
}

export default async function ProfilePage({ params, searchParams }: ProfilePageProps) {
  const { id } = await params;
  const { tab } = await searchParams;
  const user = SEED_USERS.find((u) => u.id === id);
  if (!user) notFound();
  const isOwnProfile = user.id === CURRENT_USER_ID;

  const activeTab: ProfileTab =
    tab === "donations" || tab === "following" ? tab : "fundraisers";
  const userFundraisers = SEED_FUNDRAISERS.filter(
    (f) => f.organizerId === user.id
  );
  const fundraiserTitleById = new Map(
    SEED_FUNDRAISERS.map((fundraiser) => [fundraiser.id, fundraiser.title])
  );
  const userDonations = SEED_DONATIONS.filter(
    (donation) => donation.donorName === user.name
  );
  const followedFundraiserIds = new Set(
    SEED_FAVORITES.filter((favorite) => favorite.userId === user.id).map(
      (favorite) => favorite.fundraiserId
    )
  );
  const followedUserIds = Array.from(
    new Set(
      SEED_FUNDRAISERS.filter((fundraiser) =>
        followedFundraiserIds.has(fundraiser.id)
      )
        .map((fundraiser) => fundraiser.organizerId)
        .filter((organizerId) => organizerId !== user.id)
    )
  );
  const followedUsers = followedUserIds
    .map((followedUserId) =>
      SEED_USERS.find((candidateUser) => candidateUser.id === followedUserId)
    )
    .filter((candidateUser): candidateUser is (typeof SEED_USERS)[number] =>
      Boolean(candidateUser)
    );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ProfileHeader user={user} isOwnProfile={isOwnProfile} />
        {isOwnProfile ? (
          <div className="mt-4 rounded-lg border border-border-light bg-white p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-text-primary">Your Charity Request</p>
              <p className="text-xs text-text-muted">
                Track review status, decisions, and resubmission details.
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/charity/request"
                className="px-3 py-2 rounded-md border border-border-medium text-sm font-medium text-text-primary"
              >
                View request status
              </Link>
              <Link
                href="/charity/new?source=profile_page"
                className="px-3 py-2 rounded-md bg-primary text-white text-sm font-semibold"
              >
                Start a charity
              </Link>
            </div>
          </div>
        ) : null}

        {/* Tabs */}
        <div className="mt-6 border-b border-border-light">
          <div className="flex gap-6">
            {[
              { id: "fundraisers", label: "Fundraisers" },
              { id: "donations", label: "Donations" },
              { id: "following", label: "Following" },
            ].map((tabItem) => (
              <Link
                key={tabItem.id}
                href={`/profile/${user.id}?tab=${tabItem.id}`}
                className={`pb-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  activeTab === tabItem.id
                    ? "border-primary text-primary"
                    : "border-transparent text-text-secondary hover:text-text-primary"
                }`}
              >
                {tabItem.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-6">
          {activeTab === "fundraisers" ? (
            <FundraiserList fundraisers={userFundraisers} />
          ) : null}

          {activeTab === "donations" ? (
            <div>
              {userDonations.length === 0 ? (
                <div className="text-center py-12 text-text-muted">
                  <p>No donations yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userDonations.map((donation) => (
                    <div
                      key={donation.id}
                      className="p-4 border border-border-light rounded-lg bg-white"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-text-primary truncate">
                            {fundraiserTitleById.get(donation.fundraiserId) ?? "Fundraiser"}
                          </p>
                          <p className="text-xs text-text-muted mt-0.5">
                            {timeAgo(donation.createdAt)}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-primary whitespace-nowrap">
                          {formatCents(donation.amountCents)}
                        </p>
                      </div>
                      {donation.message ? (
                        <p className="mt-2 text-sm text-text-secondary">{donation.message}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {activeTab === "following" ? (
            <div>
              {followedUsers.length === 0 ? (
                <div className="text-center py-12 text-text-muted">
                  <p>Not following any organizers yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {followedUsers.map((followedUser) => (
                    <Link
                      key={followedUser.id}
                      href={`/profile/${followedUser.id}`}
                      className="block p-4 border border-border-light rounded-lg bg-white hover:border-primary/30 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex items-start gap-3">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-bg-gray flex-shrink-0">
                            {followedUser.avatarUrl ? (
                              <Image
                                src={followedUser.avatarUrl}
                                alt={followedUser.name}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            ) : (
                              <div className="w-full h-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                                {followedUser.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-text-primary truncate">
                              {followedUser.name}
                            </p>
                            <p className="text-xs text-text-muted mt-0.5">
                              {followedUser.location ?? "Location not provided"}
                            </p>
                            {followedUser.bio ? (
                              <p className="mt-2 text-sm text-text-secondary line-clamp-2">
                                {followedUser.bio}
                              </p>
                            ) : null}
                          </div>
                        </div>
                        <div className="text-right whitespace-nowrap">
                          <p className="text-xs text-text-muted">
                            {followedUser.followerCount.toLocaleString()} followers
                          </p>
                          <p className="text-xs text-text-muted mt-1">
                            {followedUser.fundraiserCount} fundraisers
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
