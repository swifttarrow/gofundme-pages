import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  SEED_USERS,
  SEED_FUNDRAISERS,
  SEED_FAVORITES,
  SeedUser,
  formatCents,
  timeAgo,
} from "@/lib/seed-data";
import { ProfileHeader } from "@/components/profile/header";
import { FundraiserList } from "@/components/profile/fundraiser-list";
import { Badge } from "@/lib/api";
import { serverApiFetch } from "@/lib/server-api";
import { PageViewReporter } from "@/components/observability/page-view-reporter";

type ProfileTab = "fundraisers" | "donations" | "following";

interface ProfilePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}

type ApiBadge = {
  type: string;
  label: string;
  description: string;
  icon: string;
  priority: number;
  earned_at?: string;
};

type ApiProfileUser = {
  id: string;
  name: string;
  role: SeedUser["role"];
  bio: string | null;
  avatarUrl: string | null;
  backsplashUrl: string | null;
  location: string | null;
  amountRaised?: number;
  followerCount?: number;
  fundraiserCount?: number;
  donationCount?: number;
};

type ApiDonation = {
  id: string;
  fundraiser_id: string;
  fundraiser_title: string | null;
  amount_cents: number;
  message: string | null;
  created_at: string;
};

type ApiFundraiser = {
  id: string;
  organizer_name: string;
  organizer_avatar: string | null;
  title: string;
  cover_image_url: string | null;
  goal_cents: number;
  raised_cents: number;
  category: string;
  location: string | null;
  is_urgent: boolean;
  donor_count: number;
  created_at: string;
};

type FollowedUser = Pick<
  SeedUser,
  "id" | "name" | "bio" | "avatarUrl" | "location" | "followerCount" | "fundraiserCount"
>;

export async function generateStaticParams() {
  return SEED_USERS.map((u) => ({ id: u.id }));
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const { id } = await params;
  const user = await getProfileUserById(id);
  if (!user) return { title: "Profile | GoSupportMe" };
  return { title: `${user.name} | GoSupportMe` };
}

async function getAuthenticatedUser(): Promise<SeedUser | null> {
  try {
    const response = await serverApiFetch("/api/auth/me", { cache: "no-store" });

    if (!response.ok) return null;
    const payload = (await response.json()) as {
      user: {
        id: string;
        name: string;
        bio: string | null;
        avatarUrl: string | null;
        backsplashUrl: string | null;
        location: string | null;
        role: SeedUser["role"];
        amountRaised?: number;
        followerCount?: number;
        fundraiserCount?: number;
        donationCount?: number;
      };
    };

    return {
      id: payload.user.id,
      name: payload.user.name,
      bio: payload.user.bio,
      avatarUrl: payload.user.avatarUrl,
      backsplashUrl: payload.user.backsplashUrl,
      location: payload.user.location,
      role: payload.user.role,
      amountRaised: payload.user.amountRaised ?? 0,
      followerCount: payload.user.followerCount ?? 0,
      fundraiserCount: payload.user.fundraiserCount ?? 0,
      donationCount: payload.user.donationCount ?? 0,
    };
  } catch {
    return null;
  }
}

function mergeUserWithSeedStats(user: ApiProfileUser): SeedUser {
  const seedUser = SEED_USERS.find((candidate) => candidate.id === user.id);

  return {
    id: user.id,
    name: user.name,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    backsplashUrl: user.backsplashUrl,
    location: user.location,
    role: user.role,
    amountRaised: user.amountRaised ?? seedUser?.amountRaised ?? 0,
    followerCount: user.followerCount ?? seedUser?.followerCount ?? 0,
    fundraiserCount: user.fundraiserCount ?? seedUser?.fundraiserCount ?? 0,
    donationCount: user.donationCount ?? seedUser?.donationCount ?? 0,
  };
}

async function getProfileUserById(id: string): Promise<SeedUser | null> {
  try {
    const response = await serverApiFetch(`/api/auth/users/${id}`, {
      cache: "no-store",
    });
    if (response.ok) {
      const payload = (await response.json()) as { user: ApiProfileUser };
      return mergeUserWithSeedStats(payload.user);
    }
  } catch {
    // Fall back to local seed data when the API is unavailable.
  }

  return SEED_USERS.find((candidate) => candidate.id === id) ?? null;
}

async function getUserBadges(userId: string): Promise<Badge[]> {
  try {
    const response = await serverApiFetch(`/api/badges/${userId}`, {
      cache: "no-store",
    });
    if (!response.ok) return [];
    const payload = (await response.json()) as { badges: ApiBadge[] };
    return payload.badges.map((badge) => ({
      type: badge.type,
      label: badge.label,
      description: badge.description,
      icon: badge.icon,
      priority: badge.priority,
      earnedAt: badge.earned_at,
    }));
  } catch {
    return [];
  }
}

async function getUserDonations(userId: string, includeAnonymous: boolean): Promise<
  Array<{
    id: string;
    fundraiserId: string;
    fundraiserTitle: string | null;
    amountCents: number;
    message: string | null;
    createdAt: string;
  }>
> {
  try {
    const qs = new URLSearchParams({
      donorUserId: userId,
      includeAnonymous: String(includeAnonymous),
      limit: "50",
    });
    const response = await serverApiFetch(`/api/donations?${qs}`, {
      cache: "no-store",
    });
    if (!response.ok) return [];

    const payload = (await response.json()) as { donations: ApiDonation[] };
    return payload.donations.map((donation) => ({
      id: donation.id,
      fundraiserId: donation.fundraiser_id,
      fundraiserTitle: donation.fundraiser_title,
      amountCents: donation.amount_cents,
      message: donation.message,
      createdAt: donation.created_at,
    }));
  } catch {
    return [];
  }
}

async function getUserFundraisers(userId: string): Promise<(typeof SEED_FUNDRAISERS)> {
  try {
    const qs = new URLSearchParams({
      organizerId: userId,
      limit: "50",
    });
    const response = await serverApiFetch(`/api/fundraisers?${qs}`, {
      cache: "no-store",
    });
    if (!response.ok) return [];

    const payload = (await response.json()) as { fundraisers: ApiFundraiser[] };
    return payload.fundraisers.map((fundraiser) => {
      const goalCents = fundraiser.goal_cents;
      const raisedCents = fundraiser.raised_cents;
      const progressPercent =
        goalCents > 0 ? Math.round((raisedCents / goalCents) * 100) : 0;

      return {
        id: fundraiser.id,
        communityId: null,
        organizerId: userId,
        organizerName: fundraiser.organizer_name,
        organizerAvatar: fundraiser.organizer_avatar,
        title: fundraiser.title,
        story: "",
        coverImageUrl: fundraiser.cover_image_url ?? "",
        goalCents,
        raisedCents,
        category: fundraiser.category,
        location: fundraiser.location ?? "",
        isUrgent: fundraiser.is_urgent,
        donorCount: fundraiser.donor_count,
        followerCount: 0,
        createdAt: fundraiser.created_at,
        progressPercent,
      };
    });
  } catch {
    return SEED_FUNDRAISERS.filter((fundraiser) => fundraiser.organizerId === userId);
  }
}

async function getFollowedUsers(userId: string): Promise<FollowedUser[]> {
  try {
    const qs = new URLSearchParams({ follower_id: userId });
    const response = await serverApiFetch(`/api/follows?${qs}`, {
      cache: "no-store",
    });
    if (!response.ok) return [];

    const payload = (await response.json()) as { followedUsers: FollowedUser[] };
    return payload.followedUsers;
  } catch {
    const followedFundraiserIds = new Set(
      SEED_FAVORITES.filter((favorite) => favorite.userId === userId).map(
        (favorite) => favorite.fundraiserId
      )
    );
    const followedUserIds = Array.from(
      new Set(
        SEED_FUNDRAISERS.filter((fundraiser) =>
          followedFundraiserIds.has(fundraiser.id)
        )
          .map((fundraiser) => fundraiser.organizerId)
          .filter((organizerId) => organizerId !== userId)
      )
    );

    return followedUserIds
      .map((followedUserId) =>
        SEED_USERS.find((candidateUser) => candidateUser.id === followedUserId)
      )
      .filter((candidateUser): candidateUser is (typeof SEED_USERS)[number] =>
        Boolean(candidateUser)
      );
  }
}

export default async function ProfilePage({ params, searchParams }: ProfilePageProps) {
  const { id } = await params;
  const { tab } = await searchParams;
  const authenticatedUser = await getAuthenticatedUser();
  const user = await getProfileUserById(id);
  if (!user) notFound();
  const isOwnProfile = authenticatedUser?.id === user.id;
  const badges = await getUserBadges(user.id);
  const userDonations = await getUserDonations(user.id, isOwnProfile);
  const userFundraisers = await getUserFundraisers(user.id);
  const followedUsers = await getFollowedUsers(user.id);

  let hasCharityRequest = false;
  if (isOwnProfile) {
    try {
      const res = await serverApiFetch(
        `/api/charities/requests/mine?userId=${encodeURIComponent(user.id)}`,
        {
          cache: "no-store",
        }
      );
      hasCharityRequest = res.ok;
    } catch {
      // leave false
    }
  }

  const activeTab: ProfileTab =
    tab === "donations" || tab === "following" ? tab : "fundraisers";
  const fundraiserTitleById = new Map(
    [...SEED_FUNDRAISERS, ...userFundraisers].map((fundraiser) => [
      fundraiser.id,
      fundraiser.title,
    ])
  );

  return (
    <div className="min-h-screen bg-white">
      <PageViewReporter pageType="profile" />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ProfileHeader user={user} badges={badges} isOwnProfile={isOwnProfile} />
        {isOwnProfile && hasCharityRequest ? (
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
                            {donation.fundraiserTitle ??
                              fundraiserTitleById.get(donation.fundraiserId) ??
                              "Fundraiser"}
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
