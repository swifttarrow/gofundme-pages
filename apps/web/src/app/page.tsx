import Link from "next/link";
import { SEED_FUNDRAISERS } from "@/lib/seed-data";
import { CampaignCard } from "@/components/community/campaign-card";

export default function HomePage() {
  const featured = SEED_FUNDRAISERS.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-light to-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Fundraise for what matters
          </h1>
          <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
            Join millions of people using GoSupportMe to raise money for the people and causes they care about.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/charity/new"
              className="btn-primary text-center text-lg px-8 py-4"
            >
              Start a Charity
            </Link>
            <Link
              href="/community"
              className="btn-secondary text-center text-lg px-8 py-4"
            >
              View communities
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Fundraisers */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-primary">Featured fundraisers</h2>
          <Link href="/community" className="text-primary font-medium hover:underline">
            See all
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((f) => (
            <CampaignCard key={f.id} fundraiser={f} />
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-bg-gray py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-10">How GoSupportMe works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Start your fundraiser", desc: "Set up your fundraiser in minutes. Share your story and set your goal." },
              { step: "2", title: "Share with your network", desc: "Email, text, or share on social media to reach potential donors." },
              { step: "3", title: "Manage your donations", desc: "Track your progress and thank your donors in real time." },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-text-secondary text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
