import { SeedFundraiser } from "@/lib/seed-data";

export const DEFAULT_FUNDRAISER_IMAGE =
  "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&auto=format&fit=crop";

type FundraiserViewInput = {
  id: string;
  communityId?: string | null;
  organizerId?: string | null;
  organizerName?: string | null;
  organizerAvatar?: string | null;
  title: string;
  story?: string | null;
  coverImageUrl?: string | null;
  goalCents: number;
  raisedCents: number;
  category: string;
  location?: string | null;
  isUrgent?: boolean | null;
  donorCount?: number | null;
  followerCount?: number | null;
  createdAt?: string | null;
  progressPercent?: number | null;
};

function computeProgressPercent(raisedCents: number, goalCents: number): number {
  if (goalCents <= 0) {
    return 0;
  }

  return Math.max(0, Math.round((raisedCents / goalCents) * 100));
}

export function toSeedFundraiser(input: FundraiserViewInput): SeedFundraiser {
  const goalCents = Number(input.goalCents ?? 0);
  const raisedCents = Number(input.raisedCents ?? 0);

  return {
    id: input.id,
    communityId: input.communityId ?? null,
    organizerId: input.organizerId ?? "",
    organizerName: input.organizerName ?? "GoSupportMe organizer",
    organizerAvatar: input.organizerAvatar ?? null,
    title: input.title,
    story: input.story ?? "",
    coverImageUrl: input.coverImageUrl ?? DEFAULT_FUNDRAISER_IMAGE,
    goalCents,
    raisedCents,
    category: input.category,
    location: input.location ?? "",
    isUrgent: Boolean(input.isUrgent),
    donorCount: Number(input.donorCount ?? 0),
    followerCount: Number(input.followerCount ?? 0),
    createdAt: input.createdAt ?? new Date(0).toISOString(),
    progressPercent:
      input.progressPercent == null
        ? computeProgressPercent(raisedCents, goalCents)
        : Number(input.progressPercent),
  };
}
