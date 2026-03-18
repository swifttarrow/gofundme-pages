import { notFound } from "next/navigation";
import Link from "next/link";
import { SEED_FUNDRAISERS, SEED_DONATIONS } from "@/lib/seed-data";
import { FundraiserHero } from "@/components/fundraiser/hero";
import { Story } from "@/components/fundraiser/story";
import { DonationFeed } from "@/components/fundraiser/donation-feed";
import { TrustSafety } from "@/components/fundraiser/trust-safety";
import { DonationModule } from "@/components/donation-module";

interface FundraiserPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return SEED_FUNDRAISERS.map((f) => ({ id: f.id }));
}

export async function generateMetadata({ params }: FundraiserPageProps) {
  const { id } = await params;
  const fundraiser = SEED_FUNDRAISERS.find((f) => f.id === id);
  if (!fundraiser) return { title: "Fundraiser Not Found" };
  return {
    title: `${fundraiser.title} | GoSupportMe`,
    description: fundraiser.story.slice(0, 160),
    openGraph: {
      images: [fundraiser.coverImageUrl],
    },
  };
}

export default async function FundraiserPage({ params }: FundraiserPageProps) {
  const { id } = await params;
  const fundraiser = SEED_FUNDRAISERS.find((f) => f.id === id);
  if (!fundraiser) notFound();
  const currentUserId = "a1b2c3d4-0002-0002-0002-000000000002";

  const donations = SEED_DONATIONS.filter((d) => d.fundraiserId === fundraiser.id);
  const displayedDonations =
    donations.length > 0
      ? donations
      : [
          {
            id: "mock-1",
            fundraiserId: fundraiser.id,
            donorName: "Michael Chen",
            donorAvatar: "https://i.pravatar.cc/150?img=2",
            amountCents: 15000,
            message: "Sending love and prayers. Stay strong!",
            isAnonymous: false,
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: "mock-2",
            fundraiserId: fundraiser.id,
            donorName: "Anonymous",
            donorAvatar: null,
            amountCents: 10000,
            message: "Sending love and caring during difficult times.",
            isAnonymous: true,
            createdAt: new Date(Date.now() - 7200000).toISOString(),
          },
          {
            id: "mock-3",
            fundraiserId: fundraiser.id,
            donorName: "Jessica Rivera",
            donorAvatar: "https://i.pravatar.cc/150?img=3",
            amountCents: 9000,
            message: "This community is here for you. Every little helps.",
            isAnonymous: false,
            createdAt: new Date(Date.now() - 14400000).toISOString(),
          },
        ];

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
                donations={displayedDonations}
                currentUserId={currentUserId}
              />
            </div>

            <div className="mt-8">
              <Story story={fundraiser.story} organizerName={fundraiser.organizerName} />
            </div>

            <div className="mt-8">
              <DonationFeed donations={displayedDonations} totalCount={fundraiser.donorCount} />
            </div>

            <TrustSafety />
          </div>

          {/* Right column — Desktop donation module */}
          <div className="hidden lg:block w-full max-w-sm flex-shrink-0">
            <div className="sticky top-20">
              <DonationModule
                fundraiser={fundraiser}
                donations={displayedDonations}
                currentUserId={currentUserId}
              />
              <div className="mt-4 rounded-lg border border-border-light bg-white p-4 space-y-2">
                <Link
                  href="/fundraiser/new?source=post_donation_upsell"
                  className="block text-sm font-semibold text-primary hover:underline"
                >
                  Start one yourself
                </Link>
                <Link
                  href="/charity/new?source=fundraiser_page"
                  className="block text-sm font-semibold text-primary hover:underline"
                >
                  Turn this into a charity
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
