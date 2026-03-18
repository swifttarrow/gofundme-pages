import Image from "next/image";
import { notFound } from "next/navigation";
import { SEED_COMMUNITIES, SEED_FUNDRAISERS } from "@/lib/seed-data";
import { FeaturedCampaigns } from "@/components/community/featured-campaigns";
import { CommunityFeed } from "@/components/community/feed";
import { CommunitySidebar } from "@/components/community/sidebar";
import { Filters } from "@/components/community/filters";
import { CommunityFollowButton } from "@/components/community/follow-button";

interface CommunityDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return SEED_COMMUNITIES.map((community) => ({ slug: community.slug }));
}

export async function generateMetadata({ params }: CommunityDetailPageProps) {
  const { slug } = await params;
  const community = SEED_COMMUNITIES.find((item) => item.slug === slug);

  if (!community) {
    return { title: "Community Not Found | GoSupportMe" };
  }

  return {
    title: `${community.name} | GoSupportMe`,
    description: community.description,
    openGraph: {
      images: [community.coverImageUrl],
    },
  };
}

export default async function CommunityDetailPage({ params }: CommunityDetailPageProps) {
  const { slug } = await params;
  const community = SEED_COMMUNITIES.find((item) => item.slug === slug);
  if (!community) notFound();

  const communityFundraisers = SEED_FUNDRAISERS.filter((fundraiser) => fundraiser.communityId === community.id);
  const totalRaised = communityFundraisers.reduce((sum, fundraiser) => sum + fundraiser.raisedCents, 0);
  const supporterCount = communityFundraisers.reduce((sum, fundraiser) => sum + fundraiser.donorCount, 0);

  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-52 md:h-64 overflow-hidden bg-text-primary">
        <Image
          src={community.coverImageUrl}
          alt={community.name}
          fill
          className="object-cover opacity-70"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <h1 className="text-white text-2xl md:text-3xl font-bold">{community.name}</h1>
          <p className="text-white/85 text-sm mt-1 max-w-lg">{community.description}</p>
          <p className="text-white/70 text-xs mt-1">
            {community.memberCount.toLocaleString()} members
          </p>
        </div>

        <div className="absolute top-4 right-4">
          <CommunityFollowButton />
        </div>
      </div>

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
              <p className="text-lg font-bold text-text-primary">{supporterCount.toLocaleString()}</p>
              <p className="text-xs text-text-muted">Supporters</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-text-primary">{communityFundraisers.length}</p>
              <p className="text-xs text-text-muted">Fundraisers</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <Filters />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <FeaturedCampaigns fundraisers={communityFundraisers} />
            <CommunityFeed />
          </div>

          <div className="w-full lg:w-64 flex-shrink-0">
            <CommunitySidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
