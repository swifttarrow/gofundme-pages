import { SeedFundraiser } from "@/lib/seed-data";
import { CampaignCard } from "./campaign-card";

interface FeaturedCampaignsProps {
  fundraisers: SeedFundraiser[];
}

export function FeaturedCampaigns({ fundraisers }: FeaturedCampaignsProps) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold text-text-primary mb-4">Featured Fundraisers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {fundraisers.slice(0, 3).map((f) => (
          <CampaignCard key={f.id} fundraiser={f} />
        ))}
      </div>
    </section>
  );
}
