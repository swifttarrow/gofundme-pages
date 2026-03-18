import { notFound } from "next/navigation";
import { SEED_USERS, SEED_FUNDRAISERS } from "@/lib/seed-data";
import { ProfileHeader } from "@/components/profile/header";
import { FundraiserList } from "@/components/profile/fundraiser-list";
import { Badges, MOCK_BADGES } from "@/components/badges";

interface ProfilePageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  return SEED_USERS.map((u) => ({ id: u.id }));
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const user = SEED_USERS.find((u) => u.id === params.id);
  if (!user) return { title: "Profile Not Found" };
  return { title: `${user.name} | GoSupportMe` };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const user = SEED_USERS.find((u) => u.id === params.id);
  if (!user) notFound();

  const userFundraisers = SEED_FUNDRAISERS.filter(
    (f) => f.organizerId === user.id
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            <ProfileHeader user={user} />

            {/* Tabs */}
            <div className="mt-6 border-b border-border-light">
              <div className="flex gap-6">
                {["Fundraisers", "Donations", "About"].map((tab, i) => (
                  <button
                    key={tab}
                    className={`pb-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                      i === 0
                        ? "border-primary text-primary"
                        : "border-transparent text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <FundraiserList fundraisers={userFundraisers} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-72 flex-shrink-0">
            {/* Go further with following */}
            <div className="bg-white border border-border-light rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-bold text-text-primary">Go Further with Following</span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 text-xs border border-border-medium rounded-md py-2 px-3 hover:bg-bg-gray transition-colors">
                  Follow
                </button>
                <button className="flex-1 text-xs border border-border-medium rounded-md py-2 px-3 hover:bg-bg-gray transition-colors">
                  Share
                </button>
                <button className="flex-1 text-xs border border-border-medium rounded-md py-2 px-3 hover:bg-bg-gray transition-colors">
                  Donate
                </button>
              </div>
            </div>

            {/* Badges sidebar */}
            <div className="bg-white border border-border-light rounded-lg p-4 mb-4">
              <h3 className="font-bold text-sm text-text-primary mb-3">Badges</h3>
              <Badges badges={MOCK_BADGES} maxVisible={5} />
            </div>

            {/* Trust info */}
            <div className="bg-white border border-border-light rounded-lg p-4">
              <h3 className="font-bold text-sm text-text-primary mb-3">Trust Information</h3>
              <div className="space-y-2">
                {[
                  "Identity verified",
                  "Organizer in good standing",
                  "Fundraisers audited",
                  "Tax deductible eligible",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00B964" strokeWidth="2">
                      <path d="M9 12l2 2 4-4" />
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                    <span className="text-xs text-text-secondary">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Donor quality */}
            <div className="bg-white border border-border-light rounded-lg p-4 mt-4">
              <h3 className="font-bold text-sm text-text-primary mb-3">Donor Quality</h3>
              <div className="space-y-1 text-xs text-text-secondary">
                <p>• Always tips</p>
                <p>• Never charged back</p>
                <p>• Long-term donor</p>
                <p>• Community supporter</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
