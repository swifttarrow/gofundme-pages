import { CampaignCard } from "@/components/community/campaign-card";
import { serverApiFetch } from "@/lib/server-api";
import { SEED_FUNDRAISERS, type SeedFundraiser } from "@/lib/seed-data";

type ApiFundraiserSummary = {
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

const DEFAULT_FUNDRAISER_IMAGE =
  "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&auto=format&fit=crop";

export const metadata = {
  title: "Fundraisers | GoSupportMe",
  description: "Browse active fundraisers on GoSupportMe.",
};

function mapApiFundraiserToCardFundraiser(fundraiser: ApiFundraiserSummary): SeedFundraiser {
  const goalCents = Number(fundraiser.goal_cents ?? 0);
  const raisedCents = Number(fundraiser.raised_cents ?? 0);

  return {
    id: fundraiser.id,
    communityId: null,
    organizerId: "",
    organizerName: fundraiser.organizer_name,
    organizerAvatar: fundraiser.organizer_avatar,
    title: fundraiser.title,
    story: "",
    coverImageUrl: fundraiser.cover_image_url ?? DEFAULT_FUNDRAISER_IMAGE,
    goalCents,
    raisedCents,
    category: fundraiser.category,
    location: fundraiser.location ?? "",
    isUrgent: Boolean(fundraiser.is_urgent),
    donorCount: Number(fundraiser.donor_count ?? 0),
    followerCount: 0,
    createdAt: fundraiser.created_at,
    progressPercent: goalCents > 0 ? Math.round((raisedCents / goalCents) * 100) : 0,
  };
}

async function getFundraisers(): Promise<SeedFundraiser[]> {
  try {
    const qs = new URLSearchParams({
      limit: "24",
    });
    const response = await serverApiFetch(`/api/fundraisers?${qs}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return SEED_FUNDRAISERS;
    }

    const payload = (await response.json()) as {
      fundraisers: ApiFundraiserSummary[];
    };

    if (payload.fundraisers.length === 0) {
      return SEED_FUNDRAISERS;
    }

    return payload.fundraisers.map(mapApiFundraiserToCardFundraiser);
  } catch {
    return SEED_FUNDRAISERS;
  }
}

export default async function FundraisersPage() {
  const fundraisers = await getFundraisers();

  return (
    <div className="min-h-screen bg-white">
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary">Fundraisers</h1>
          <p className="mt-2 text-text-secondary">
            Browse active fundraisers and discover causes that need support right now.
          </p>
        </div>

        {fundraisers.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {fundraisers.map((fundraiser) => (
              <CampaignCard key={fundraiser.id} fundraiser={fundraiser} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border-light bg-bg-gray/40 px-6 py-10 text-center">
            <p className="text-lg font-semibold text-text-primary">No fundraisers available</p>
            <p className="mt-2 text-sm text-text-secondary">
              Check back soon for new causes to support.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
