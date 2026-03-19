import { notFound } from "next/navigation";
import {
  SEED_FUNDRAISERS,
  type SeedDonation,
  type SeedFundraiser,
} from "@/lib/seed-data";
import { FundraiserHero } from "@/components/fundraiser/hero";
import { Story } from "@/components/fundraiser/story";
import { DonationFeed } from "@/components/fundraiser/donation-feed";
import { TrustSafety } from "@/components/fundraiser/trust-safety";
import { DonationModule } from "@/components/donation-module";
import { CampaignCard } from "@/components/community/campaign-card";
import { serverApiFetch } from "@/lib/server-api";
import { toSeedFundraiser, DEFAULT_FUNDRAISER_IMAGE } from "@/lib/fundraiser-view";
import { PageViewReporter } from "@/components/observability/page-view-reporter";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

interface FundraiserPageProps {
  params: Promise<{ id: string }>;
}

type ApiFundraiserResponse = {
  id: string;
  organizer_id: string;
  organizer_name: string;
  organizer_avatar: string | null;
  title: string;
  story: string;
  cover_image_url: string | null;
  goal_cents: number;
  raised_cents: number;
  category: string;
  location: string | null;
  is_urgent: boolean;
  donor_count: number;
  follower_count: number;
  created_at: string;
  progressPercent: number;
  recentDonations: Array<{
    id: string;
    donor_user_id: string | null;
    amount_cents: number;
    is_anonymous: boolean;
    message: string | null;
    created_at: string;
    donor_name: string;
    donor_avatar: string | null;
  }>;
};

type ApiRecommendationResponse = {
  recommendations: Array<{
    fundraiserId: string;
    fundraiser: {
      title: string;
      coverImageUrl: string | null;
      goalCents: number;
      raisedCents: number;
      category: string;
      donorCount: number;
    };
  }>;
};

type ApiFeedResponse = {
  items: Array<{
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
    follower_count: number;
    created_at: string;
    progress_percent: number | null;
  }>;
};

export async function generateStaticParams() {
  return SEED_FUNDRAISERS.map((f) => ({ id: f.id }));
}

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

async function getApiFundraiser(id: string): Promise<ApiFundraiserResponse | null> {
  try {
    const response = await serverApiFetch(`/api/fundraisers/${id}`, {
      cache: "no-store",
    });
    if (!response.ok) return null;
    return (await response.json()) as ApiFundraiserResponse;
  } catch {
    return null;
  }
}

async function getSimilarFundraisers(
  fundraiser: SeedFundraiser,
  currentUserId: string | null
): Promise<SeedFundraiser[]> {
  try {
    if (currentUserId) {
      const response = await serverApiFetch(
        `/api/recommendations?user_id=${encodeURIComponent(currentUserId)}&limit=6`,
        { cache: "no-store" }
      );

      if (response.ok) {
        const payload = (await response.json()) as ApiRecommendationResponse;
        const recommendations = payload.recommendations
          .filter((item) => item.fundraiserId !== fundraiser.id)
          .slice(0, 4)
          .map((item) =>
            toSeedFundraiser({
              id: item.fundraiserId,
              title: item.fundraiser.title,
              coverImageUrl: item.fundraiser.coverImageUrl,
              goalCents: item.fundraiser.goalCents,
              raisedCents: item.fundraiser.raisedCents,
              category: item.fundraiser.category,
              donorCount: item.fundraiser.donorCount,
            })
          );

        if (recommendations.length > 0) {
          return recommendations;
        }
      }
    }

    const response = await serverApiFetch(
      `/api/feed?category=${encodeURIComponent(fundraiser.category)}&sort=trending&limit=6`,
      { cache: "no-store" }
    );
    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as ApiFeedResponse;
    return payload.items
      .filter((item) => item.id !== fundraiser.id)
      .slice(0, 4)
      .map((item) =>
        toSeedFundraiser({
          id: item.id,
          organizerName: item.organizer_name,
          organizerAvatar: item.organizer_avatar,
          title: item.title,
          coverImageUrl: item.cover_image_url,
          goalCents: Number(item.goal_cents ?? 0),
          raisedCents: Number(item.raised_cents ?? 0),
          category: item.category,
          location: item.location ?? "",
          isUrgent: item.is_urgent,
          donorCount: Number(item.donor_count ?? 0),
          followerCount: Number(item.follower_count ?? 0),
          createdAt: item.created_at,
          progressPercent: Number(item.progress_percent ?? 0),
        })
      );
  } catch {
    return [];
  }
}

function mapApiFundraiserToSeed(fundraiser: ApiFundraiserResponse): SeedFundraiser {
  return toSeedFundraiser({
    id: fundraiser.id,
    communityId: null,
    organizerId: fundraiser.organizer_id,
    organizerName: fundraiser.organizer_name,
    organizerAvatar: fundraiser.organizer_avatar,
    title: fundraiser.title,
    story: fundraiser.story,
    coverImageUrl: fundraiser.cover_image_url ?? DEFAULT_FUNDRAISER_IMAGE,
    goalCents: Number(fundraiser.goal_cents ?? 0),
    raisedCents: Number(fundraiser.raised_cents ?? 0),
    category: fundraiser.category,
    location: fundraiser.location ?? "",
    isUrgent: Boolean(fundraiser.is_urgent),
    donorCount: Number(fundraiser.donor_count ?? 0),
    followerCount: Number(fundraiser.follower_count ?? 0),
    createdAt: fundraiser.created_at,
    progressPercent: Number(fundraiser.progressPercent ?? 0),
  });
}

function mapApiDonationToSeed(
  fundraiserId: string,
  donation: ApiFundraiserResponse["recentDonations"][number]
): SeedDonation {
  return {
    id: donation.id,
    fundraiserId,
    donorUserId: donation.donor_user_id,
    donorName: donation.donor_name,
    donorAvatar: donation.donor_avatar,
    amountCents: Number(donation.amount_cents ?? 0),
    message: donation.message,
    isAnonymous: donation.is_anonymous,
    createdAt: donation.created_at,
  };
}

function buildFundraiserDescription(fundraiser: SeedFundraiser) {
  const normalizedStory = fundraiser.story.replace(/\s+/g, " ").trim();
  const summary = normalizedStory.slice(0, 140).trim();

  if (summary.length > 0) {
    return `${summary}${normalizedStory.length > 140 ? "..." : ""}`;
  }

  return `Support ${fundraiser.organizerName}'s fundraiser on GoSupportMe.`;
}

export async function generateMetadata({ params }: FundraiserPageProps) {
  const { id } = await params;
  const apiFundraiser = await getApiFundraiser(id);
  const fundraiser = apiFundraiser
    ? mapApiFundraiserToSeed(apiFundraiser)
    : SEED_FUNDRAISERS.find((f) => f.id === id);
  if (!fundraiser) return { title: "Fundraiser Not Found" };
  const description = buildFundraiserDescription(fundraiser);
  const fundraiserUrl = `${APP_URL}/fundraiser/${fundraiser.id}`;

  return {
    title: `${fundraiser.title} | GoSupportMe`,
    description,
    alternates: {
      canonical: `/fundraiser/${fundraiser.id}`,
    },
    openGraph: {
      title: fundraiser.title,
      description,
      url: fundraiserUrl,
      siteName: "GoSupportMe",
      type: "article",
      images: [
        {
          url: fundraiser.coverImageUrl,
          alt: fundraiser.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fundraiser.title,
      description,
      images: [fundraiser.coverImageUrl],
    },
  };
}

export default async function FundraiserPage({ params }: FundraiserPageProps) {
  const { id } = await params;
  const apiFundraiser = await getApiFundraiser(id);
  const fundraiser = apiFundraiser
    ? mapApiFundraiserToSeed(apiFundraiser)
    : SEED_FUNDRAISERS.find((f) => f.id === id);
  if (!fundraiser) notFound();
  const currentUserId = await getAuthenticatedUserId();
  const similarFundraisers = await getSimilarFundraisers(fundraiser, currentUserId);

  const donations = apiFundraiser
    ? apiFundraiser.recentDonations.map((donation) => mapApiDonationToSeed(fundraiser.id, donation))
    : [];

  return (
    <div className="min-h-screen bg-white">
      <PageViewReporter pageType="fundraiser" />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column */}
          <div className="flex-1 min-w-0">
            <FundraiserHero fundraiser={fundraiser} currentUserId={currentUserId ?? undefined} />

            {/* Mobile donation module */}
            <div className="lg:hidden mt-6">
              <DonationModule
                fundraiser={fundraiser}
                donations={donations}
                currentUserId={currentUserId ?? undefined}
              />
            </div>

            <div className="mt-8">
              <Story story={fundraiser.story} organizerName={fundraiser.organizerName} />
            </div>

            <div className="mt-8">
              <DonationFeed
                donations={donations}
                currentUserId={currentUserId ?? undefined}
              />
            </div>

            <TrustSafety />

            {similarFundraisers.length > 0 ? (
              <section className="mt-10">
                <h2 className="text-xl font-bold text-text-primary">Similar causes you may care about</h2>
                <p className="text-sm text-text-secondary mt-1 mb-4">
                  Explore related campaigns based on category fit and active supporter momentum.
                </p>
                <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                  {similarFundraisers.map((item) => (
                    <div key={item.id} className="min-w-[280px] max-w-[320px] flex-shrink-0">
                      <CampaignCard fundraiser={item} />
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          {/* Right column — Desktop donation module */}
          <div className="hidden lg:block w-full max-w-sm flex-shrink-0">
            <div className="sticky top-20">
              <DonationModule
                fundraiser={fundraiser}
                donations={donations}
                currentUserId={currentUserId ?? undefined}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
