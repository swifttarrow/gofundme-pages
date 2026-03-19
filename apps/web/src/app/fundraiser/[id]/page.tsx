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

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const DEFAULT_FUNDRAISER_IMAGE =
  "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&auto=format&fit=crop";

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
    amount_cents: number;
    is_anonymous: boolean;
    message: string | null;
    created_at: string;
    donor_name: string;
    donor_avatar: string | null;
  }>;
};

export async function generateStaticParams() {
  return SEED_FUNDRAISERS.map((f) => ({ id: f.id }));
}

async function getApiFundraiser(id: string): Promise<ApiFundraiserResponse | null> {
  try {
    const response = await fetch(`${API_BASE}/api/fundraisers/${id}`, { cache: "no-store" });
    if (!response.ok) return null;
    return (await response.json()) as ApiFundraiserResponse;
  } catch {
    return null;
  }
}

function mapApiFundraiserToSeed(fundraiser: ApiFundraiserResponse): SeedFundraiser {
  return {
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
  };
}

function mapApiDonationToSeed(
  fundraiserId: string,
  donation: ApiFundraiserResponse["recentDonations"][number]
): SeedDonation {
  return {
    id: donation.id,
    fundraiserId,
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
  const currentUserId = "a1b2c3d4-0002-0002-0002-000000000002";

  const donations = apiFundraiser
    ? apiFundraiser.recentDonations.map((donation) => mapApiDonationToSeed(fundraiser.id, donation))
    : [];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column */}
          <div className="flex-1 min-w-0">
            <FundraiserHero fundraiser={fundraiser} />

            {/* Mobile donation module */}
            <div className="lg:hidden mt-6">
              <DonationModule
                fundraiser={fundraiser}
                donations={donations}
                currentUserId={currentUserId}
              />
            </div>

            <div className="mt-8">
              <Story story={fundraiser.story} organizerName={fundraiser.organizerName} />
            </div>

            <div className="mt-8">
              <DonationFeed donations={donations} totalCount={fundraiser.donorCount} />
            </div>

            <TrustSafety />
          </div>

          {/* Right column — Desktop donation module */}
          <div className="hidden lg:block w-full max-w-sm flex-shrink-0">
            <div className="sticky top-20">
              <DonationModule
                fundraiser={fundraiser}
                donations={donations}
                currentUserId={currentUserId}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
