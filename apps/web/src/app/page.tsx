"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { SEED_COMMUNITIES, SEED_FUNDRAISERS, SEED_NETWORK_POSTS, SEED_USERS } from "@/lib/seed-data";
import { CampaignCard } from "@/components/community/campaign-card";
import { AuthUser, getCurrentUser } from "@/lib/api";

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const featured = SEED_FUNDRAISERS.slice(0, 3);
  const featuredCommunities = SEED_COMMUNITIES.slice(0, 3);
  const fromNetwork = [...SEED_NETWORK_POSTS]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4)
    .map((post) => {
      const author = SEED_USERS.find((user) => user.id === post.authorId);
      const fundraiser = SEED_FUNDRAISERS.find((item) => item.id === post.fundraiserId);
      if (!author || !fundraiser) {
        return null;
      }
      return { post, author, fundraiser };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  useEffect(() => {
    let isMounted = true;

    getCurrentUser()
      .then((response) => {
        if (isMounted) {
          setCurrentUser(response.user);
        }
      })
      .catch(() => {
        if (isMounted) {
          setCurrentUser(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

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

      {/* Featured Fundraisers */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-primary">Featured fundraisers</h2>
          <Link href="/fundraisers" className="text-primary font-medium hover:underline">
            See all
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((f) => (
            <CampaignCard key={f.id} fundraiser={f} />
          ))}
        </div>
      </section>

      {/* Featured Communities */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-primary">Featured communities</h2>
          <Link href="/community" className="text-primary font-medium hover:underline">
            Explore all
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCommunities.map((community) => (
            <Link
              key={community.id}
              href={`/community/${community.slug}`}
              className="group block rounded-xl border border-border-light overflow-hidden hover:shadow-sm transition-shadow"
            >
              <div className="relative h-32">
                <Image
                  src={community.coverImageUrl}
                  alt={community.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/35" />
              </div>
              <div className="bg-white p-5">
                <h3 className="text-lg font-semibold text-text-primary mb-1">{community.name}</h3>
                <p className="text-sm text-text-muted mb-3">
                  {community.memberCount.toLocaleString()} members
                </p>
                <p className="text-sm text-text-secondary">{community.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {currentUser ? (
        <section className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-text-primary">From your network</h2>
          </div>
          <div className="space-y-3">
            {fromNetwork.map(({ post, author, fundraiser }) => (
              <article
                key={post.id}
                className="rounded-lg border border-border-light p-4 bg-white"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-text-primary">{author.name}</p>
                  <p className="text-xs text-text-muted">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
                <p className="text-sm text-text-secondary mt-2">{post.content}</p>
                <Link
                  href={`/fundraiser/${fundraiser.id}`}
                  className="inline-flex items-center mt-3 text-sm text-primary font-medium hover:underline"
                >
                  View fundraiser: {fundraiser.title}
                </Link>
              </article>
            ))}
          </div>
        </section>
      ) : null}

    </div>
  );
}
