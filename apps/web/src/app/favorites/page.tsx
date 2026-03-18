import Link from "next/link";
import { CampaignCard } from "@/components/community/campaign-card";
import { SEED_FAVORITES, SEED_FUNDRAISERS } from "@/lib/seed-data";

const CURRENT_USER_ID = "a1b2c3d4-0002-0002-0002-000000000002";

export const metadata = {
  title: "Favorites | GoSupportMe",
  description: "Fundraisers you have saved to revisit later.",
};

export default function FavoritesPage() {
  const favoriteFundraisers = SEED_FAVORITES
    .filter((favorite) => favorite.userId === CURRENT_USER_ID)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((favorite) => SEED_FUNDRAISERS.find((fundraiser) => fundraiser.id === favorite.fundraiserId))
    .filter((fundraiser): fundraiser is NonNullable<typeof fundraiser> => fundraiser !== undefined);

  return (
    <div className="min-h-screen bg-white">
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-text-primary">Favorites</h1>
          <Link href="/" className="text-primary font-medium hover:underline">
            Back to home
          </Link>
        </div>

        {favoriteFundraisers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteFundraisers.map((fundraiser) => (
              <CampaignCard key={fundraiser.id} fundraiser={fundraiser} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-border-light p-6">
            <p className="text-text-secondary">You have no favorites yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}
